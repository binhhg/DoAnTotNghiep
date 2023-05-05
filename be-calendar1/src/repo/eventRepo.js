module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Event } = schemas
  const addEvent = (cate) => {
    const c = new Event(cate)
    return c.save()
  }
  const getEventById = (id) => {
    return Event.findById(id)
  }
  const deleteEvent = (id) => {
    return Event.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateEvent = (id, n) => {
    return Event.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Event.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Event.countDocuments(pipe)
  }
  const getEventAgg = (pipe) => {
    return Event.aggregate(pipe)
  }
  const getEvent = (pipe, limit, skip, sort) => {
    return Event.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getEventNoPaging = (pipe) => {
    return Event.find(pipe)
  }
  const removeEvent = (pipe) => {
    return Event.deleteMany(pipe)
  }
  return {
    getEventNoPaging,
    removeEvent,
    addEvent,
    getEventAgg,
    getEventById,
    deleteEvent,
    updateEvent,
    checkIdExist,
    getCount,
    getEvent
  }
}
