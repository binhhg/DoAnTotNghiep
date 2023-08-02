module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Watch } = schemas
  const addWatch = (cate) => {
    const c = new Watch(cate)
    return c.save()
  }
  const getWatchById = (id) => {
    return Watch.findById(id)
  }
  const deleteWatch = (id) => {
    return Watch.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateWatch = (id, n) => {
    return Watch.findByIdAndUpdate(id, n, {
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
    return Watch.find(pipe, { email: 1 })
  }
  const getWatchProfile = (pipe) => {
    return Watch.find(pipe, { email: 1, photo: 1 })
  }
  const getWatchFindOne = (pipe) => {
    return Watch.findOne(pipe)
  }
  const removeWatch = (pipe) => {
    return Watch.deleteMany(pipe)
  }
  const getWatchSortProvider = (pipe) => {
    return Watch.find(pipe).sort({ provider: 1 })
  }
  return {
    getWatchNoPaging,
    removeWatch,
    addWatch,
    getWatchAgg,
    getWatchById,
    deleteWatch,
    updateWatch,
    checkIdExist,
    getCount,
    getWatch,
    getWatchFindOne,
    getWatchSortProvider,
    getWatchProfile
  }
}
