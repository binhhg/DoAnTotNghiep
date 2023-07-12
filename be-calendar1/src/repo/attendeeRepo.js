module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Attendee } = schemas
  const addAttendee = (cate) => {
    const c = new Attendee(cate)
    return c.save()
  }

  const getAttendeeById = (id) => {
    return Attendee.findById(id)
  }
  const deleteAttendee = (id) => {
    return Attendee.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateAttendee = (id, n) => {
    return Attendee.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Attendee.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Attendee.countDocuments(pipe)
  }
  const getAttendeeAgg = (pipe) => {
    return Attendee.aggregate(pipe)
  }
  const getAttendee = (pipe, limit, skip, sort) => {
    return Attendee.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getAttendeeNoPaging = (pipe) => {
    return Attendee.find(pipe)
  }
  const removeAttendee = (pipe) => {
    return Attendee.deleteMany(pipe)
  }
  return {
    getAttendeeNoPaging,
    removeAttendee,
    addAttendee,
    getAttendeeAgg,
    getAttendeeById,
    deleteAttendee,
    updateAttendee,
    checkIdExist,
    getCount,
    getAttendee
  }
}
