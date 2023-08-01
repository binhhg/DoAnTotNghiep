module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Config } = schemas
  const addConfig = (cate) => {
    const c = new Config(cate)
    return c.save()
  }
  const getConfigById = (id) => {
    return Config.findById(id)
  }
  const deleteConfig = (id) => {
    return Config.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateConfig = (id, n) => {
    return Config.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Config.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Config.countDocuments(pipe)
  }
  const getConfigAgg = (pipe) => {
    return Config.aggregate(pipe)
  }
  const getConfig = (pipe, limit, skip, sort) => {
    return Config.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getConfigNoPaging = (pipe) => {
    return Config.find(pipe)
  }
  const getConfigFindOne = (pipe) => {
    return Config.findOne(pipe)
  }
  const removeConfig = (pipe) => {
    return Config.deleteMany(pipe)
  }
  const updateOne = (pipe, update) => {
    return Config.findOneAndUpdate(pipe, update)
  }
  const updateOneConfig = (pipe,up) => {
    return Config.updateOne(pipe,up)
  }
  return {
    getConfigNoPaging,
    removeConfig,
    addConfig,
    getConfigAgg,
    getConfigById,
    deleteConfig,
    updateConfig,
    checkIdExist,
    getCount,
    getConfig,
    getConfigFindOne,
    updateOne,
    updateOneConfig
  }
}
