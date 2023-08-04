module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Watch } = schemas
  const createWatch = (data) => {
    const n = new Watch(data)
    return n.save()
  }
  const getWatchById = (id) => {
    return Watch.findById(id)
  }
  const deleteWatch = (id) => {
    return Watch.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateWatch = (id, data) => {
    return Watch.findByIdAndUpdate(id, data, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Watch.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Watch.countDocuments(pipe)
  }
  const getWatchAgg = (pipe) => {
    return Watch.aggregate(pipe)
  }
  const getWatch = (pipe, limit, skip, sort) => {
    return Watch.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getWatchNoPaging = (pipe) => {
    return Watch.find(pipe)
  }
  const removeWatch = (pipe) => {
    return Watch.deleteMany(pipe)
  }
  const findOne = (pipe) => {
    return Watch.findOne(pipe)
  }
  return {
    getWatchNoPaging,
    removeWatch,
    createWatch,
    getWatchAgg,
    getWatchById,
    deleteWatch,
    updateWatch,
    checkIdExist,
    getCount,
    getWatch,
    findOne
  }
}
