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
    const updateEvent = async (req, res) => {
        try {
            const {id} = req.params
            const event = req.body
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
                    value['$unset'] = {rrule: ''}
                }

                const qq = await eventRepo.updateEvent(id, value)
                if (event.accounts && event.accounts.length) { // co account
                    const id = (event.accounts)[0].value
                    const {statusCode, data} = await userHelper.getAccountById(id)
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
                            return res.status(httpCode.BAD_REQUEST).json({msg: e})
                        }
                        const book = await bookingRepo.addBooking(v)
                        qq.booking = book
                        console.log('booo', book)
                        console.log('event', qq)
                        result.push(qq)
                        return res.status(httpCode.CREATED).json({data: result})
                    } else {
                        const {ok, data: d} = await googleHelper.getEventById(data.refreshToken, id)
                        if (!ok) {
                            console.log('243')
                            return res.status(httpCode.BAD_REQUEST).json({msg: 'loi k tim thay event tren google calendar'})
                        }

                    }
                }
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
