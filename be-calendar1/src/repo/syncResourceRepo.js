module.exports = container => {
  const { schemas } = container.resolve('models')
  const { SyncResource } = schemas
  const addSyncResource = (cate) => {
    const c = new SyncResource(cate)
    return c.save()
  }

  const getSyncResourceById = (id) => {
    return SyncResource.findById(id)
  }
  const deleteSyncResource = (id) => {
    return SyncResource.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateSyncResource = (id, n) => {
    return SyncResource.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkExist = (pipe) => {
    return SyncResource.findOne(pipe)
  }
  const getCount = (pipe = {}) => {
    return SyncResource.countDocuments(pipe)
  }
  const getSyncResourceAgg = (pipe) => {
    return SyncResource.aggregate(pipe)
  }
  const getSyncResource = (pipe, limit, skip, sort) => {
    return SyncResource.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getSyncResourceNoPaging = (pipe) => {
    return SyncResource.find(pipe)
  }
  const removeSyncResource = (pipe) => {
    return SyncResource.deleteMany(pipe)
  }
  return {
    getSyncResourceNoPaging,
    removeSyncResource,
    addSyncResource,
    getSyncResourceAgg,
    getSyncResourceById,
    deleteSyncResource,
    updateSyncResource,
    checkExist,
    getCount,
    getSyncResource
  }
}
