module.exports = container => {
  const { schemas } = container.resolve('models')
  const { User } = schemas
  const addUser = (cate) => {
    const c = new User(cate)
    return c.save()
  }
  const getUserById = (id) => {
    return User.findById(id)
  }
  const deleteUser = (id) => {
    return User.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateUser = (id, n) => {
    return User.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return User.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return User.countDocuments(pipe)
  }
  const getUserAgg = (pipe) => {
    return User.aggregate(pipe)
  }
  const getUser = (pipe, limit, skip, sort) => {
    return User.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getUserNoPaging = (pipe) => {
    return User.find(pipe)
  }
  const removeUser = (pipe) => {
    return User.deleteMany(pipe)
  }
  return {
    getUserNoPaging,
    removeUser,
    addUser,
    getUserAgg,
    getUserById,
    deleteUser,
    updateUser,
    checkIdExist,
    getCount,
    getUser
  }
}
