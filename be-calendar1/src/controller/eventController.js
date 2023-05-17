module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Event
    }
  } = container.resolve('models')
  const { httpCode, eventConfig, actionConfig } = container.resolve('config')
  const { googleHelper, userHelper } = container.resolve('helper')
  const mediator = container.resolve('mediator')
  const { eventRepo, bookingRepo } = container.resolve('repo')

  function formatData (data) {
    const qq = {
      summary: data.summary,
      location: data?.location,
      description: data?.description || '',
      start: data?.start,
      end: data?.end,
      attendees: data?.attendees
    }
    return qq
  }

  const addEvent = async (req, res) => {
    try {
      const body = req.body
      const {
        error,
        value
      } = await schemaValidator(body, 'Event')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
      }
      const event = await eventRepo.addEvent(value)
      if (value.isBooking) {
        const send = formatData(body)
        const { statusCode, data } = await userHelper.getAccountById(body.userId)
        if (statusCode !== httpCode.SUCCESS) {
          return res.status(httpCode.BAD_REQUEST).json({ msg: 'co loi xay ra' })
        }
        const { ok, data: dd } = await googleHelper.addCalendar(data.refreshToken, send)
        if (!ok) {
          return res.status(httpCode.BAD_REQUEST).json({ msg: 'co loi trong qua trinh dong bo calendar' })
        }
        body.calendarId = dd.id
        const {
          error: e,
          value: v
        } = await schemaValidator(body, 'Account')
        if (e) {
          return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
        }
        const book = await bookingRepo.addBooking(v)
        event.booking = book
      }
      res.status(httpCode.CREATED).json(event)
    } catch (e) {
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Vị trí này đã tồn tại.' })
      }
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const deleteEvent = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        await eventRepo.deleteEvent(id)
        res.status(httpCode.SUCCESS).send({ ok: true })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateEvent = async (req, res) => {
    try {
      const { id } = req.params
      const event = req.body
      const {
        error,
        value
      } = await schemaValidator(event, 'Event')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      if (id && event) {
        const item = await eventRepo.updateEvent(id, value)
        res.status(httpCode.SUCCESS).json(item)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getEventById = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const event = await eventRepo.getEventById(id)
        res.status(httpCode.SUCCESS).send(event)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getEvent = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
        ids
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { _id: 1 } : +sort || { _id: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      if (ids) {
        if (ids.constructor === Array) {
          search.id = { $in: ids }
        } else if (ids.constructor === String) {
          search.id = { $in: ids.split(',') }
        }
      }
      delete search.ids
      delete search.page
      delete search.perPage
      delete search.sort
      const pipe = {}
      Object.keys(search).forEach(i => {
        const vl = search[i]
        const pathEvent = (Event.schema.path(i) || {}).instance || ''
        if (pathEvent.toLowerCase() === 'objectid') {
          pipe[i] = ObjectId(vl)
        } else if (pathEvent === 'Number') {
          pipe[i] = +vl
        } else if (pathEvent === 'String' && vl.constructor === String) {
          pipe[i] = new RegExp(vl, 'gi')
        } else {
          pipe[i] = vl
        }
      })
      const data = await eventRepo.getEvent(pipe, perPage, skip, sort)
      const total = await eventRepo.getCount(pipe)
      res.status(httpCode.SUCCESS).send({
        perPage,
        skip,
        sort,
        data,
        total,
        page
      })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
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
