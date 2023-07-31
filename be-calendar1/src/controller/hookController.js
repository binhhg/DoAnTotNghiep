const moment = require('moment')
module.exports = container => {
    const logger = container.resolve('logger')
    const ObjectId = container.resolve('ObjectId')
    const {googleHelper, userHelper} = container.resolve('helper')
    const {httpCode, eventConfig, actionConfig} = container.resolve('config')
    const {eventRepo, bookingRepo, syncResourceRepo} = container.resolve('repo')
    const {
        schemaValidator,
        schemas: {
            Event
        }
    } = container.resolve('models')

    function getDuration(start, end) {
        if (!start || !end) {
            return '00:00'
        }
        const startMoment = moment(start)
        const endMoment = moment(end)
        const duration = moment.duration(endMoment.diff(startMoment))
        const days = duration.days()
        const hours = duration.hours()
        const minutes = duration.minutes()
        return `${hours + days * 24}:${minutes.toString().padStart(2, '0')}`
    }

    const text2Rrule = (qq) => {
        const zz = qq.replace('RRULE:', '').split(';')

        const rrule = {}
        for (const z of zz) {
            const dm = z.split('=')
            if (dm[0] === 'BYDAY') {
                console.log(dm[1])
                if (+(dm[1]).charAt(0)) {
                    rrule['bysetpos'] = +(dm[1]).charAt(0)
                    rrule['byweekday'] = dm[1].slice(1).split(',')
                } else {
                    rrule['byweekday'] = dm[1].split(',')
                }

            } else {
                rrule[`${dm[0].toLowerCase()}`] = +dm[1] ? +dm[1] : dm[1]
            }
        }
        return rrule
    }
    const formatData = (data, account) => {
        const ev = {
            userId: account.userId,
            title: data.summary,
            description: data.description,
            location: data.location,
            allDay: data?.start?.date ? 1 : 0,
            start: data?.start?.date ? data.start.date : moment(data.start.dateTime).toJSON(),
            end: data?.end?.date ? data.end.date : moment(data.end.dateTime).toJSON(),
        }
        if (data.recurrence) {
            ev.rrule = text2Rrule(data.recurrence[0])
            ev.duration = getDuration(ev.start, ev.end)
        }
        const boo = {
            calendarId: data.id,
            userId: account.userId,
            accountId: account._id,
            attendees: data?.attendees,
            hangoutLink: data?.hangoutLink,
            recurrence: data?.recurrence,
            organizer: data?.organizer,
            createdBy: data?.createdBy,
            originalStartTime: data?.originalStartTime,
            recurringEventId: data?.recurringEventId
        }
        return {event: ev, booking: boo}
    }
    const hook = async (req, res) => {
        try {
            const headers = req.headers
            console.log('headers',headers)
            const accountId = headers['x-goog-channel-token']
            const {statusCode, data} = await userHelper.getAccountById(accountId)
            if (headers['x-goog-resource-state'] === 'sync') { // dong bo lan dau
                const zz = await syncResourceRepo.checkExist({accountId: new ObjectId(accountId)})
                if (zz) {
                    return res.status(httpCode.SUCCESS).json({ok: true})
                }
                const {ok, data: cals} = await googleHelper.getListCalendar(data.refreshToken)
                await syncResourceRepo.addSyncResource({
                    accountId: new ObjectId(accountId),
                    syncToken: cals.nextSyncToken
                })
                const {items} = cals
                for (const item of items) {
                    if (item.status === 'cancelled') {
                        if (item.recurringEventId) {
                            const check = await bookingRepo.findOneAndPopulate({calendarId: item.recurringEventId}).lean()
                            if (check) {
                                await eventRepo.updateEvent(check.eventId, {
                                    $push: {
                                        exdate: item.originalStartTime.date ? item.originalStartTime.date : moment(item.originalStartTime.dateTime).toJSON()
                                    }
                                })
                            }
                        }
                        continue
                    }
                    const {event, booking} = formatData(item, data)
                    const {error, value} = schemaValidator(event, 'Event')
                    if (error) {
                        console.log(error)
                        res.status(httpCode.BAD_REQUEST).json({ok: true})
                    }
                    let zz = await eventRepo.addEvent(value)
                    zz = zz.toObject()
                    booking.eventId = zz._id
                    const {error: er1, value: va1} = schemaValidator(booking, 'Booking')
                    if (er1) {
                        console.log(er1)
                        res.status(httpCode.BAD_REQUEST).json({ok: true})
                    }
                    await bookingRepo.addBooking(va1)
                    if (va1.recurringEventId) {
                        const check = await bookingRepo.findOneAndPopulate({calendarId: va1.recurringEventId}).lean()
                        if (check) {
                            await eventRepo.updateEvent(check.eventId, {
                                $push: {
                                    exdate: va1.originalStartTime.date ? va1.originalStartTime.date : moment(va1.originalStartTime.dateTime).toJSON()
                                }
                            })
                        }
                    }
                }
                res.status(httpCode.SUCCESS).json({ok: true})
            }
            const sync = await syncResourceRepo.checkExist({accountId: new ObjectId(accountId)}).lean()
            if(!sync){
                return res.status(httpCode.BAD_REQUEST).json({msg: 'k co sync'})
            }
            const {ok, data: syn} = await googleHelper.getListSyncToken(data.refreshToken, sync.syncToken)
            if(!ok){
                return res.status(httpCode.BAD_REQUEST).json({msg: 'loi lay ban ghi voi syncToken r'})
            }
            await syncResourceRepo.updateSyncResource(sync._id, {
                syncToken: syn.nextSyncToken
            })
            const {items} = syn
            for (const item of items) {
                if (item.status === 'cancelled') {
                    const check = await bookingRepo.findOneAndPopulate({calendarId: item.recurringEventId}).lean()
                    if (check) {
                        if (item.recurringEventId) {
                            await eventRepo.updateEvent(check.eventId, {
                                $push: {
                                    exdate: item.originalStartTime.date ? item.originalStartTime.date : moment(item.originalStartTime.dateTime).toJSON()
                                }
                            })
                            continue
                        }
                        await eventRepo.deleteEvent(check.eventId)
                    }
                    continue
                }
                const check = await bookingRepo.findOneAndPopulate({calendarId: item.recurringEventId}).lean()
                const {event, booking} = formatData(item, data)
                if (!check) { //tao moi
                    const {error, value} = schemaValidator(event, 'Event')
                    if (error) {
                        console.log(error)
                        res.status(httpCode.BAD_REQUEST).json({ok: true})
                    }
                    let zz = await eventRepo.addEvent(value)
                    zz = zz.toObject()
                    booking.eventId = zz._id
                    const {error: er1, value: va1} = schemaValidator(booking, 'Booking')
                    if (er1) {
                        console.log(er1)
                        res.status(httpCode.BAD_REQUEST).json({ok: true})
                    }
                    await bookingRepo.addBooking(va1)
                    if (va1.recurringEventId) {
                        const check = await bookingRepo.findOneAndPopulate({calendarId: va1.recurringEventId}).lean()
                        if (check) {
                            await eventRepo.updateEvent(check.eventId, {
                                $push: {
                                    exdate: va1.originalStartTime.date ? va1.originalStartTime.date : moment(va1.originalStartTime.dateTime).toJSON()
                                }
                            })
                        }
                    }
                } else {
                    const {eventId: oldEv} = check
                    booking.eventId = check._id
                    const {error, value} = schemaValidator(event, 'Event')
                    if (error) {
                        console.log(error)
                        res.status(httpCode.BAD_REQUEST).end()
                    }
                    if(oldEv.rrule && !value.rrule){
                        value.$unset = {rrule: '', duration: ''}
                    }
                    await eventRepo.updateEvent(oldEv._id,value)
                    const {error: er1, value: va1} = schemaValidator(booking,'Booking')
                    if (er1) {
                        console.log(er1)
                        res.status(httpCode.BAD_REQUEST).end()
                    }
                    if(check.recurrence && !va1.recurrence){
                        va1.$unset = {recurrence: ''}
                    }
                    await bookingRepo.updateBooking(check._id, va1)
                }
            }
            res.status(httpCode.SUCCESS).json({ok: true})
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).end()
        }
    }
    return {hook}
}
