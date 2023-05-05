module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Booking
    }
  } = container.resolve('models')
  const { httpCode, eventConfig, actionConfig } = container.resolve('config')
  const mediator = container.resolve('mediator')
  const { eventRepo, bookingRepo } = container.resolve('repo')
  const addBooking = async (req, res) => {
    try {
      const body = req.body
      const {
        error,
        value
      } = await schemaValidator(body, 'Booking')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
      }
      const booking = await bookingRepo.addBooking(value)
      setTimeout(async () => {
        const event = await eventRepo.getEventById(value.eventId.toString()).lean()
        event.booking = booking
        mediator.emit(eventConfig.GOOGLE_CALENDAR, {
          action: actionConfig.CREATE,
          payload: event
        })
      }, 1)
      res.status(httpCode.CREATED).json(booking)
    } catch (e) {
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Vị trí này đã tồn tại.' })
      }
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const deleteBooking = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        await bookingRepo.deleteBooking(id)
        res.status(httpCode.SUCCESS).send({ ok: true })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateBooking = async (req, res) => {
    try {
      const { id } = req.params
      const booking = req.body
      const {
        error,
        value
      } = await schemaValidator(booking, 'Booking')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      if (id && booking) {
        const item = await bookingRepo.updateBooking(id, value)
        res.status(httpCode.SUCCESS).json(item)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getBookingById = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const booking = await bookingRepo.getBookingById(id)
        res.status(httpCode.SUCCESS).send(booking)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getBooking = async (req, res) => {
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
        const pathBooking = (Booking.schema.path(i) || {}).instance || ''
        if (pathBooking.toLowerCase() === 'objectid') {
          pipe[i] = ObjectId(vl)
        } else if (pathBooking === 'Number') {
          pipe[i] = +vl
        } else if (pathBooking === 'String' && vl.constructor === String) {
          pipe[i] = new RegExp(vl, 'gi')
        } else {
          pipe[i] = vl
        }
      })
      const data = await bookingRepo.getBooking(pipe, perPage, skip, sort)
      const total = await bookingRepo.getCount(pipe)
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
    addBooking,
    getBooking,
    getBookingById,
    updateBooking,
    deleteBooking
  }
}
