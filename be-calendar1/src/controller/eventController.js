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
    const EventTypeConfig = {
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
            },
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
            rule = rule + `COUNT=${rrule.count}`
        }
        if (rrule.until) {
            rule = rule + `UNTIL=${rrule.until}`
        }
        return rule
    }

    function formatDataUpdate(data, dataGoogle) {
        const qq = {
            summary: data.title,
            location: data?.location,
            description: data?.description,
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
                rule = rule + `UNTIL=${data.rrule.until}`
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
                console.log('vay day')
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
    const deleteEvent = async (req, res) => {
        try {
            const {id} = req.params
            if (id) {
                await eventRepo.deleteEvent(id)
                res.status(httpCode.SUCCESS).send({ok: true})
            } else {
                res.status(httpCode.BAD_REQUEST).end()
            }
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    const addBooking = async (eventId, id, userId, refreshToken, send) => {
        try {
            const {ok, data: dd} = await googleHelper.addCalendar(refreshToken, send)
            if (!ok) {
                return {msg: 'co loi trong qua trinh dong bo calendar', ok: false}
            }
            const bodyAcc = {
                calendarId: dd.id,
                eventId: eventId.toString(),
                type: 1,
                userId: userId.toString(),
                accountId: id,
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
                return {msg: e, ok: false}
            }
            const book = await bookingRepo.addBooking(v)
            return {ok: true, book}
        } catch (e) {
            return {ok: true, msg: e}
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
                    value['$unset'] = {rrule: '', duration: ''}
                }
                const qq = await eventRepo.updateEvent(id, value).lean()
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
                    exdate: moment(value.start).format('YYYY-MM-DD')
                })
                result.push(ev)
                let addEvent = await eventRepo.addEvent(value)
                addEvent = event.toObject()
                if (event.accounts && event.accounts.length) {
                    const send = formatData(event)
                    if (event.booking) { // kp account mac dinh, origin thi can lay ngay can sua
                        send.recurringEventId = id
                        send.originalStartTime = {
                            dateTime: event.originalStartTime, // chua sua
                            timeZone: 'Asia/Ho_Chi_Minh'
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
                        console.log('booo', book)
                        console.log('event', addEvent)
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
                        until: event.originalStartTime
                    }
                })
                const addEv = await event.addEvent(value)
                if (event.accounts && event.accounts.length) {
                    const send = formatData(event)
                    if (event.booking) {
                        const recurrence = rruleTotext(upEv.rrule)
                        const accountId = event.booking.accountId
                        const {statusCode, data} = await userHelper.getAccountById(accountId)
                        if (statusCode !== httpCode.SUCCESS) {
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi xay ra'})
                        }
                        const upGoogle1 = await googleHelper.updateCalendarPatch(data.refreshToken, id, recurrence)
                        upEv.booking = upGoogle1
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
                        const {ok, data: dd} = await googleHelper.addCalendar(accountId, send)
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
                })
                value.end = moment(enRoot).set({
                    hour: moment(value.end).hour(),
                    minute: moment(value.end).minute(),
                    second: moment(value.end).second()
                })
                const upEv = await eventRepo.updateEvent(id, value).lean()
                if (event.accounts && event.accounts.length) {
                    const accountId = (event.accounts)[0].value

                    const {statusCode, data} = await userHelper.getAccountById(accountId)
                    if (statusCode !== httpCode.SUCCESS) {
                        return res.status(httpCode.BAD_REQUEST).json({msg: 'co loi xay ra'})
                    }
                    const send = formatData({...event,...value})
                    if (event.booking) {
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
                        } = await googleHelper.updateCalendar(data.refreshToken, calendarId, event)
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
    const getEventById = async (req, res) => {
        try {
            const {id} = req.params
            const body = req.body
            if (id) {
                if (!body.type || body.type === eventConfig.NOT_RECURRING) {
                    await eventRepo.deleteEvent(id)
                    const check = await bookingRepo.findOneBooking({eventId: new ObjectId(id)}).lean()
                    if (check) {
                    }
                    return res.status(httpCode.SUCCESS).json({ok: true})
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
            const data = await eventRepo.getEventAgg(pipe)
            res.status(httpCode.SUCCESS).json(data)
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    return {
        addEvent,
        getEvent,
        getEventById,
        updateEvent,
        deleteEvent
    }
}
