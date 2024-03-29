const moment = require('moment')
module.exports = (container) => {
    const logger = container.resolve('logger')
    const ObjectId = container.resolve('ObjectId')
    const {
        schemaValidator,
        schemas: {
            Event
        }
    } = container.resolve('models')
    const {httpCode, eventConfig, actionConfig} = container.resolve('config')
    const {googleHelper, userHelper} = container.resolve('helper')
    const mediator = container.resolve('mediator')
    const {eventRepo, bookingRepo} = container.resolve('repo')
    const eventTypeConfig = {
        NOT_RECURRING: 1,
        RECURRING: 2
    }
    const deleteTypeConfig = {
        ONLY: 1,
        THIS_AND_THEN: 2,
        ALL: 3
    }
    const editConfig = {
        NONE: 0,
        ONLY: 1,
        THIS_AND_THEN: 2,
        ALL: 3
    }

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
        const durationFormatted = `${hours + days * 24}:${minutes.toString().padStart(2, '0')}`
        return durationFormatted
    }

    function formatData(data) {
        const qq = {
            summary: data.title,
            location: data?.location,
            description: data?.description,
            reminders: {
                useDefault: true
            }
        }
        if (data.attendees && data.attendees.length) {
            qq.conferenceData = {
                createRequest: {
                    requestId: '7qxalsvy0e',
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet'
                    }
                }
            }
            qq.attendees = data.attendees.map(va => {
                return {email: va}
            })
        }
        if (data.allDay) {
            const formatStart = moment(data.start)
            const formatEnd = moment(data.end)
            qq.start = {
                date: formatStart.format('YYYY-MM-DD'),
                timeZone: 'Asia/Ho_Chi_Minh'
            }
            qq.end = {
                date: formatEnd.format('YYYY-MM-DD'),
                timeZone: 'Asia/Ho_Chi_Minh'
            }
        } else {
            qq.start = {
                dateTime: data.start,
                timeZone: 'Asia/Ho_Chi_Minh'
            }
            qq.end = {
                dateTime: data.end,
                timeZone: 'Asia/Ho_Chi_Minh'
            }
        }
        if (data.rrule) {
            let rule = `RRULE:FREQ=${data.rrule.freq}`
            if (data.rrule.byweekday) {
                rule = rule + ';BYDAY=' + `${data.rrule?.bysetpos || ''}${data.rrule.byweekday.join(',')}`
            }
            qq.recurrence = [rule]
        }
        return qq
    }

    const rruleTotext = (rrule) => {
        let rule = `RRULE:FREQ=${rrule.freq}`
        if (rrule.byweekday) {
            rule = rule + ';BYDAY=' + `${rrule?.bysetpos || ''}${rrule.byweekday.join(',')}`
        }
        if (rrule.count) {
            rule = rule + `;COUNT=${rrule.count}`
        }
        if (rrule.until) {
            const aa = moment(rrule.until).subtract(1, 'days').format('YYYYMMDD') + 'T170000Z'
            rule = rule + `;UNTIL=${aa}`
        }
        return rule
    }

    function formatDataUpdate(data, dataGoogle) {
        const qq = {
            summary: data.title,
            location: data?.location,
            description: data?.description
        }
        if (data.attendees && data.attendees.length && (!dataGoogle.attendees || (dataGoogle.attendees || []).length === 0)) {
            qq.conferenceData = {
                createRequest: {
                    requestId: '7qxalsvy0e',
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet'
                    }
                }
            }
        }
        if ((data.attendees || []).length === 0) {
            qq.attendees = []
        } else {
            const zz = (dataGoogle.attendees || []).filter(va => data.attendees.includes(va?.email))
            const mai = zz.map(va => va.email)
            const newMail = data.attendees.filter(va => !mai.includes(va))
            const cc = newMail.map(va => {
                return {email: va}
            })
            qq.attendees = [...zz, ...cc]
        }
        if (data.allDay) {
            const formatStart = moment(data.start)
            const formatEnd = moment(data.end)
            qq.start = {
                date: formatStart.format('YYYY-MM-DD'),
                timeZone: 'Asia/Ho_Chi_Minh'
            }
            qq.end = {
                date: formatEnd.format('YYYY-MM-DD'),
                timeZone: 'Asia/Ho_Chi_Minh'
            }
        } else {
            qq.start = {
                dateTime: data.start,
                timeZone: 'Asia/Ho_Chi_Minh'
            }
            qq.end = {
                dateTime: data.end,
                timeZone: 'Asia/Ho_Chi_Minh'
            }
        }
        if (data.rrule) {
            let rule = `RRULE:FREQ=${data.rrule.freq}`
            if (data.rrule.byweekday) {
                rule = rule + ';BYDAY=' + `${data.rrule?.bysetpos || ''}${data.rrule.byweekday.join(',')}`
            }
            if (data.rrule.count) {
                rule = rule + `COUNT=${data.rrule.count}`
            }
            if (data.rrule.until) {
                const aa = moment(data.rrule.until).subtract(1, 'days').format('YYYYMMDD') + 'T170000Z'
                rule = rule + `UNTIL=${aa}`
            }
            qq.recurrence = [rule]
        }
        return qq
    }

    const addEvent = async (req, res) => {
        try {
            const {userId} = req.user
            const body = req.body
            body.userId = userId
            if (body.allDay) {
                body.allDay = 1
            } else {
                body.allDay = 0
            }
            if (!body.title) {
                body.title = '(Không có tiêu đề)'
            }
            if (body.rrule) {
                body.duration = getDuration(body.start, body.end)
            }
            const {
                error,
                value
            } = await schemaValidator(body, 'Event')
            if (error) {
                return res.status(httpCode.BAD_REQUEST).json({msg: error.message})
            }
            const result = []
            if (body.accounts && body.accounts.length) {
                const accounts = body.accounts
                const send = formatData(body)
                for (const va of accounts) {
                    let event = await eventRepo.addEvent(value)
                    event = event.toObject()
                    const {statusCode, data} = await userHelper.getAccountById(va.value)
                    if (statusCode !== httpCode.SUCCESS) {
                        return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi xay ra'})
                    }
                    const {ok, data: dd} = await googleHelper.addCalendar(data.refreshToken, send)
                    if (!ok) {
                        return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi trong qua trinh dong bo calendar'})
                    }
                    body.calendarId = dd.id
                    const bodyAcc = {
                        calendarId: dd.id,
                        eventId: event._id.toString(),
                        type: 1,
                        userId: userId.toString(),
                        accountId: va.value,
                        attendees: dd.attendees,
                        hangoutLink: dd.hangoutLink,
                        creator: dd.creator,
                        sequence: dd.sequence,
                        organizer: dd.organizer,
                        recurrence: dd?.recurrence
                    }
                    const {
                        error: e,
                        value: v
                    } = await schemaValidator(bodyAcc, 'Booking')
                    if (e) {
                        return res.status(httpCode.BAD_REQUEST).json({msg: e})
                    }
                    const book = await bookingRepo.addBooking(v)
                    event.booking = book
                    console.log('booo', book)
                    console.log('event', event)
                    result.push(event)
                }
            } else {
                const event = await eventRepo.addEvent(value)
                result.push(event)
            }
            res.status(httpCode.CREATED).json({data: result})
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).end()
        }
    }
    const updateEvent = async (req, res) => {
        try {
            const {userId} = req.user
            const {id} = req.params
            const event = req.body
            event.userId = userId
            if (event.allDay) {
                event.allDay = 1
            } else {
                event.allDay = 0
            }
            if (event.rrule) {
                event.duration = getDuration(event.start, event.end)
            }
            const result = []
            const {
                error,
                value
            } = await schemaValidator(event, 'Event')
            if (error) {
                return res.status(httpCode.BAD_REQUEST).send({msg: error.message})
            }
            if (event.checkEdit === 0) {
                if (event.removeRrule) {
                    if (value.rrule) delete value.rrule
                    value.$unset = {rrule: '', duration: ''}
                }
                const qq = await eventRepo.updateEvent(id, value).lean()
                qq.up = 1
                if (event.accounts && event.accounts.length) { // co account
                    const accountId = (event.accounts)[0].value

                    const {statusCode, data} = await userHelper.getAccountById(accountId)
                    if (statusCode !== httpCode.SUCCESS) {
                        return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi xay ra'})
                    }
                    const send = formatData(event)
                    if (!event.booking) { // gio moi booking
                        const {ok, data: dd} = await googleHelper.addCalendar(data.refreshToken, send)
                        if (!ok) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi trong qua trinh dong bo calendar'})
                        }
                        const bodyAcc = {
                            calendarId: dd.id,
                            eventId: qq._id.toString(),
                            type: 1,
                            userId: userId.toString(),
                            accountId: accountId,
                            attendees: dd.attendees,
                            hangoutLink: dd.hangoutLink,
                            creator: dd.creator,
                            sequence: dd.sequence,
                            organizer: dd.organizer,
                            recurrence: dd?.recurrence
                        }
                        const {
                            error: e,
                            value: v
                        } = await schemaValidator(bodyAcc, 'Booking')
                        if (e) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: e})
                        }
                        const book = await bookingRepo.addBooking(v)
                        qq.booking = book
                        result.push(qq)
                        return res.status(httpCode.CREATED).json({data: result})
                    } else { // booking roi update lai
                        const calendarId = event.booking.calendarId
                        const {ok, data: d} = await googleHelper.getCalendarById(data.refreshToken, calendarId)
                        if (!ok) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'loi k tim thay event tren google calendar'})
                        }
                        const dat = formatDataUpdate(event, d)
                        const up = {...d, ...dat}
                        if (event.removeRrule) up.recurrence = []
                        const {
                            ok: o,
                            data: re
                        } = await googleHelper.updateCalendar(data.refreshToken, calendarId, up)
                        if (!o) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi trong qua trinh dong bo calendar'})
                        }
                        const booking = await bookingRepo.updateBooking(event.booking._id, {
                            attendees: re?.attendees,
                            hangoutLink: re?.hangoutLink,
                            sequence: re?.sequence,
                            recurrence: re?.recurrence || []
                        })
                        qq.booking = booking
                        console.log('booo', booking)
                        console.log('event', qq)
                        result.push(qq)
                        return res.status(httpCode.CREATED).json({data: result})
                    }
                }
                result.push(qq)
                return res.status(httpCode.SUCCESS).json({data: result})
            } else if (event.checkEdit === 1) { // chinh sua su kien lap lai: chi su kien nay
                const ev = await eventRepo.updateEvent(id, {
                    $push: {exdate: event?.originalStartDate? moment(event?.originalStartDate).format('YYYYMMDD') : moment.utc(event.originalStartDateTime).format('YYYYMMDDTHHmmss\\Z')}
                }).lean()
                ev.up = 1
                const boo = await bookingRepo.findOneBooking({eventId: ev._id})
                ev.booking = boo
                result.push(ev)
                delete value.rrule
                let addEvent = await eventRepo.addEvent(value)
                addEvent = addEvent.toObject()
                if (event.accounts && event.accounts.length) {
                    delete event.rrule
                    const send = formatData(event)
                    if (event.booking) { // kp account mac dinh, origin thi can lay ngay can sua
                        send.recurringEventId = event.booking.calendarId
                        if(event.originalStartDate){
                            send.originalStartTime = {
                                date: event.originalStartDateTime, // chua sua
                                timeZone: 'Asia/Ho_Chi_Minh'
                            }
                        } else {
                            send.originalStartTime = {
                                dateTime: event.originalStartDateTime, // chua sua
                                timeZone: 'Asia/Ho_Chi_Minh'
                            }
                        }
                        const accountId = event.booking.accountId
                        const {statusCode, data} = await userHelper.getAccountById(accountId)
                        if (statusCode !== httpCode.SUCCESS) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi xay ra'})
                        }
                        const {ok, data: dd} = await googleHelper.addCalendar(data.refreshToken, send)
                        if (!ok) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi trong qua trinh dong bo calendar'})
                        }
                        const bodyAcc = {
                            calendarId: dd.id,
                            eventId: addEvent._id.toString(),
                            type: 1,
                            userId: userId.toString(),
                            accountId: accountId,
                            attendees: dd.attendees,
                            hangoutLink: dd.hangoutLink,
                            creator: dd.creator,
                            sequence: dd.sequence,
                            organizer: dd.organizer,
                            originalStartTime: dd?.originalStartTime,
                            recurringEventId: dd?.recurringEventId
                        }
                        const {
                            error: e,
                            value: v
                        } = await schemaValidator(bodyAcc, 'Booking')
                        if (e) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: e})
                        }
                        const book = await bookingRepo.addBooking(v)
                        addEvent.booking = book
                        result.push(addEvent)
                        return res.status(httpCode.SUCCESS).json({data: result})
                    } else {
                        const accountId = (event.accounts)[0].value
                        const {statusCode, data} = await userHelper.getAccountById(accountId)
                        if (statusCode !== httpCode.SUCCESS) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi xay ra'})
                        }
                        const {ok, data: dd} = await googleHelper.addCalendar(data.refreshToken, send)
                        if (!ok) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi trong qua trinh dong bo calendar'})
                        }
                        const bodyAcc = {
                            calendarId: dd.id,
                            eventId: addEvent._id.toString(),
                            type: 1,
                            userId: userId.toString(),
                            accountId: accountId,
                            attendees: dd.attendees,
                            hangoutLink: dd.hangoutLink,
                            creator: dd.creator,
                            sequence: dd.sequence,
                            organizer: dd.organizer
                        }
                        const {
                            error: e,
                            value: v
                        } = await schemaValidator(bodyAcc, 'Booking')
                        if (e) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: e})
                        }
                        const book = await bookingRepo.addBooking(v)
                        addEvent.booking = book
                        result.push(addEvent)
                        return res.status(httpCode.SUCCESS).json({data: result})
                    }
                } else {
                    result.push(addEvent)
                    return res.status(httpCode.SUCCESS).json({data: result})
                }
            } else if (event.checkEdit === 2) {
                const upEv = await eventRepo.updateEvent(id, {
                    rrule: {
                        ...event.initRrule,
                        until: moment(event.originalStartDateTime || event.originalStartDate).set({
                            hour: 0,
                            minute: 0,
                            second: 0
                        }).toJSON()
                    }
                }).lean()
                upEv.up = 1
                let addEv = await eventRepo.addEvent(value)
                addEv = addEv.toObject()
                if (event.accounts && event.accounts.length) {
                    const send = formatData(event)
                    if (event.booking) {
                        const recurrence = rruleTotext(upEv.rrule)
                        const accountId = event.booking.accountId
                        const {statusCode, data} = await userHelper.getAccountById(accountId)
                        if (statusCode !== httpCode.SUCCESS) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi xay ra'})
                        }
                        const {
                            ok: o1,
                            data: data1
                        } = await googleHelper.updateCalendarPatch(data.refreshToken, event.booking.calendarId, {recurrence: [recurrence]})
                        if (!o1) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi trong qua trinh dong bo calendar'})
                        }
                        const upBooking = await bookingRepo.updateBooking(event.booking._id, {
                            attendees: data1?.attendees,
                            hangoutLink: data1?.hangoutLink,
                            recurrence: data1?.recurrence,
                            sequence: data1?.sequence
                        })
                        upEv.booking = upBooking
                        result.push(upEv)
                        const {ok, data: dd} = await googleHelper.addCalendar(data.refreshToken, send)
                        if (!ok) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi trong qua trinh dong bo calendar'})
                        }
                        const bodyAcc = {
                            calendarId: dd.id,
                            eventId: addEv._id.toString(),
                            type: 1,
                            userId: userId.toString(),
                            accountId: accountId,
                            attendees: dd.attendees,
                            hangoutLink: dd.hangoutLink,
                            creator: dd.creator,
                            sequence: dd.sequence,
                            organizer: dd.organizer
                        }
                        const {
                            error: e,
                            value: v
                        } = await schemaValidator(bodyAcc, 'Booking')
                        if (e) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: e})
                        }
                        const book = await bookingRepo.addBooking(v)
                        addEv.booking = book
                        console.log('booo', book)
                        console.log('event', addEv)
                        result.push(addEv)
                        return res.status(httpCode.SUCCESS).json({data: result})
                    } else {
                        const accountId = (event.accounts)[0].value
                        const {statusCode, data} = await userHelper.getAccountById(accountId)
                        if (statusCode !== httpCode.SUCCESS) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi xay ra'})
                        }
                        const {ok, data: dd} = await googleHelper.addCalendar(data.refreshToken, send)
                        if (!ok) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi trong qua trinh dong bo calendar'})
                        }
                        const bodyAcc = {
                            calendarId: dd.id,
                            eventId: addEv._id.toString(),
                            type: 1,
                            userId: userId.toString(),
                            accountId: accountId,
                            attendees: dd.attendees,
                            hangoutLink: dd.hangoutLink,
                            creator: dd.creator,
                            sequence: dd.sequence,
                            organizer: dd.organizer
                        }
                        const {
                            error: e,
                            value: v
                        } = await schemaValidator(bodyAcc, 'Booking')
                        if (e) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: e})
                        }
                        const book = await bookingRepo.addBooking(v)
                        addEv.booking = book
                        console.log('booo', book)
                        console.log('event', addEv)
                        result.push(upEv)
                        result.push(addEv)
                        return res.status(httpCode.SUCCESS).json({data: result})
                    }
                }
                result.push(upEv)
                result.push(addEv)
                return res.status(httpCode.SUCCESS).json({data: result})
            } else {
                const {start: stRoot, end: enRoot} = event.rootData
                value.start = moment(stRoot).set({
                    hour: moment(value.start).hour(),
                    minute: moment(value.start).minute(),
                    second: moment(value.start).second()
                }).toJSON()
                value.end = moment(enRoot).set({
                    hour: moment(value.end).hour(),
                    minute: moment(value.end).minute(),
                    second: moment(value.end).second()
                }).toJSON()
                const upEv = await eventRepo.updateEvent(id, value).lean()
                upEv.up = 1
                if (event.accounts && event.accounts.length) {
                    const accountId = (event.accounts)[0].value

                    const {statusCode, data} = await userHelper.getAccountById(accountId)
                    if (statusCode !== httpCode.SUCCESS) {
                        return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi xay ra'})
                    }
                    if (event.booking) {
                        const calendarId = event.booking.calendarId
                        const {ok, data: d} = await googleHelper.getCalendarById(data.refreshToken, calendarId)
                        if (!ok) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'loi k tim thay event tren google calendar'})
                        }
                        const dat = formatDataUpdate({...event, start: value.start, end: value.end}, d)
                        const up = {...d, ...dat}
                        const {
                            ok: o,
                            data: re
                        } = await googleHelper.updateCalendar(data.refreshToken, calendarId, up)
                        if (!o) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi trong qua trinh dong bo calendar'})
                        }
                        const booking = await bookingRepo.updateBooking(event.booking._id, {
                            attendees: re?.attendees,
                            hangoutLink: re?.hangoutLink,
                            recurrence: re?.recurrence,
                            sequence: re?.sequence
                        })
                        upEv.booking = booking
                        console.log('booo', booking)
                        console.log('event', upEv)
                        result.push(upEv)
                        return res.status(httpCode.CREATED).json({data: result})
                    } else {
                        const send = formatData({...event, ...value})
                        const {ok, data: dd} = await googleHelper.addCalendar(data.refreshToken, send)
                        if (!ok) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi trong qua trinh dong bo calendar'})
                        }
                        const bodyAcc = {
                            calendarId: dd.id,
                            eventId: upEv._id.toString(),
                            type: 1,
                            userId: userId.toString(),
                            accountId: accountId,
                            attendees: dd.attendees,
                            hangoutLink: dd.hangoutLink,
                            creator: dd.creator,
                            sequence: dd.sequence,
                            organizer: dd.organizer,
                            recurrence: dd?.recurrence
                        }
                        const {
                            error: e,
                            value: v
                        } = await schemaValidator(bodyAcc, 'Booking')
                        if (e) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: e})
                        }
                        const book = await bookingRepo.addBooking(v)
                        upEv.booking = book
                        console.log('booo', book)
                        console.log('event', upEv)
                        result.push(upEv)
                        return res.status(httpCode.CREATED).json({data: result})
                    }
                }
                result.push(upEv)
                return res.status(httpCode.CREATED).json({data: result})
            }
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    const deleteEvent = async (req, res) => {
        try {
            const {id} = req.params
            const body = req.body
            if (id) {
                if (!body.type || body.type === eventTypeConfig.NOT_RECURRING) {
                    await eventRepo.deleteEvent(id)
                    if (body.calendarId && body.accountId && body.bookingId) {
                        const {data} = await userHelper.getAccountById(body.accountId)
                        if (data) {
                            setTimeout(async () => {
                                await googleHelper.deleteCalendar(data.refreshToken, body.calendarId)
                            }, 1)
                            await bookingRepo.deleteBooking(body.bookingId)
                        }
                    }
                    return res.status(httpCode.SUCCESS).json({data: [{id: id, type: 'delete'}]})
                } else {
                    if (body.delete === 1) {
                        let del
                        if(body.allDay){
                            del = moment(body.start).format('YYYYMMDD')
                        } else {
                            del = moment.utc(body.start).format('YYYYMMDDTHHmmss\\Z')
                        }
                        const up = await eventRepo.updateEvent(id, {
                            $push: {
                                exdate: del
                            }
                        }).lean()
                        if (body.calendarId && body.accountId) {
                            const {data} = await userHelper.getAccountById(body.accountId)
                            if (data) {
                                const booking = await bookingRepo.getBookingById(body.bookingId)
                                up.booking = booking
                                let b
                                if(body.calendarId.includes('_')){
                                    b = body.calendarId.split('_')[0]
                                } else {
                                    b = body.calendarId
                                }
                                setTimeout(async () => {
                                    await googleHelper.deleteCalendar(data.refreshToken, b + `_${del}`)
                                }, 1)
                            }
                        }
                        return res.status(httpCode.SUCCESS).json({data: [{id: id, type: 'update', data: up}]})
                    }
                    if (body.delete === 2) {
                        const up = await eventRepo.updateEvent(id, {
                            rrule: {
                                ...body?.rrule,
                                // until: moment(body.start).subtract(1, 'days').format('YYYYMMDD') + 'T170000Z'
                                until: moment(body.start).set({
                                    hour: 0,
                                    minute: 0,
                                    second: 0
                                }).toJSON()
                            }
                        }).lean()
                        if (body.calendarId && body.accountId) {
                            const {data} = await userHelper.getAccountById(body.accountId)
                            if (data) {
                                const {
                                    ok,
                                    data: da
                                } = await googleHelper.getCalendarById(data.refreshToken, body.calendarId)
                                if (ok) {
                                    const {recurrence} = da
                                    let a = ''
                                    if (recurrence[0].includes('UNTIL')) {
                                        const b = recurrence[0].split(';')
                                        for (const c of b) {
                                            if (!c.includes('UNTIL')) {
                                                a += ';' + c
                                            }
                                        }
                                        a = a.slice(1)
                                    } else {
                                        a = recurrence
                                    }
                                    a += `;UNTIL=${moment(body.start).subtract(1, 'days').format('YYYYMMDD') + 'T170000Z'}`
                                    const {
                                        ok: ok1,
                                        data: data1
                                    } = await googleHelper.updateCalendarPatch(data.refreshToken, body.calendarId, {recurrence: [a]})
                                    if (!ok1) {
                                        return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi xay ra khi dong bo'})
                                    }
                                    const booking = await bookingRepo.updateBooking(body.bookingId, {
                                        recurrence: data1.rerecurrence,
                                        sequence: data1.sequence
                                    })
                                    up.booking = booking
                                    return res.status(httpCode.SUCCESS).json({
                                        data: [{
                                            id: id,
                                            type: 'update',
                                            data: up
                                        }]
                                    })
                                }
                            }
                        }
                        return res.status(httpCode.SUCCESS).json({data: [{id: id, type: 'update', data: up}]})
                    } else {
                        if (body.calendarId && body.accountId) {
                            const agg = [
                                {
                                    $match: {
                                        calendarId: body.calendarId
                                    }
                                },
                                {
                                    $graphLookup: {
                                        from: 'bookings',
                                        startWith: '$calendarId',
                                        connectFromField: 'calendarId',
                                        connectToField: 'recurringEventId',
                                        maxDepth: 3,
                                        depthField: 'depth',
                                        as: 'child'
                                    }
                                }, {
                                    $addFields: {
                                        events: '$child.eventId'
                                    }
                                },
                                {
                                    $addFields: {
                                        bookings: '$child._id'
                                    }
                                }

                            ]
                            const data = await bookingRepo.getBookingAgg(agg)
                            const {events, bookings} = data[0]
                            bookings.push(data[0]._id)
                            events.push(data[0].eventId)
                            await eventRepo.removeEvent({_id: {$in: events}})
                            const {data: da} = await userHelper.getAccountById(body.accountId)
                            setTimeout(async () => {
                                await googleHelper.deleteCalendar(da.refreshToken, body.calendarId)
                                await bookingRepo.removeBooking({_id: {$in: bookings}})
                            }, 1)
                            const mapp = events.map(va => {
                                return {
                                    id: va,
                                    type: 'delete'
                                }
                            })
                            return res.status(httpCode.SUCCESS).json({data: mapp})
                        } else {
                            await eventRepo.deleteEvent(id)
                            return res.status(httpCode.SUCCESS).json({data: [{id: id, type: 'delete'}]})
                        }
                    }
                }
            } else {
                res.status(httpCode.BAD_REQUEST).end()
            }
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    const getEvent = async (req, res) => {
        try {
            const {level} = req.query
            const {userId} = req.user
            const pipe = [
                {
                    $match: {
                        userId: new ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: 'bookings',
                        localField: '_id',
                        foreignField: 'eventId',
                        as: 'booking'
                    }
                },
                {
                    $addFields: {
                        booking: {
                            $arrayElemAt: ['$booking', 0]
                        }
                    }
                }
            ]
            if (level) {
                console.log('zz')
                pipe[0].$match.state = +level
            }
            const data = await eventRepo.getEventAgg(pipe)
            res.status(httpCode.SUCCESS).json(data)
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    const updateLevel = async (req, res) => {
        try {
            const {id} = req.params
            const {state} = req.body
            console.log(state)
            await eventRepo.updateEvent(id, {$set: {state: +state}})
            res.status(httpCode.SUCCESS).json({ok: true})
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    return {
        addEvent,
        getEvent,
        deleteEvent,
        updateEvent,
        updateLevel
    }
}
