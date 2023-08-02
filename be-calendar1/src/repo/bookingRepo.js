module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Booking } = schemas
  const addBooking = (cate) => {
    const c = new Booking(cate)
    return c.save()
  }
  const getBookingById = (id) => {
    return Booking.findById(id)
  }
  const deleteBooking = (id) => {
    return Booking.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateBooking = (id, n) => {
    return Booking.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Booking.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Booking.countDocuments(pipe)
  }
  const getBookingAgg = (pipe) => {
    return Booking.aggregate(pipe)
  }
  const getBooking = (pipe, limit, skip, sort) => {
    return Booking.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getBookingNoPaging = (pipe) => {
    return Booking.find(pipe)
  }
  const removeBooking = (pipe) => {
    return Booking.deleteMany(pipe)
  }
  const findOneBooking = (pipe) => {
    return Booking.findOne(pipe)
  }
  const findOneAndPopulate = (pipe) => {
    return Booking.findOne(pipe).populate('eventId')
  }
  const findMany = (pipe) => {
    return Booking.find(pipe).populate('eventId')
  }
  return {
    getBookingNoPaging,
    removeBooking,
    addBooking,
    getBookingAgg,
    getBookingById,
    deleteBooking,
    updateBooking,
    checkIdExist,
    getCount,
    getBooking,
    findOneBooking,
    findOneAndPopulate,
    findMany
  }
}
