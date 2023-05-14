module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Account } = schemas
  const addAccount = (cate) => {
    const c = new Account(cate)
    return c.save()
  }
  const getAccountById = (id) => {
    return Account.findById(id)
  }
  const deleteAccount = (id) => {
    return Account.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateAccount = (id, n) => {
    return Account.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Account.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Account.countDocuments(pipe)
  }
  const getAccountAgg = (pipe) => {
    return Account.aggregate(pipe)
  }
  const getAccount = (pipe, limit, skip, sort) => {
    return Account.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getAccountNoPaging = (pipe) => {
    return Account.find(pipe)
  }
  const getAccountFindOne = (pipe) => {
    return Account.findOne(pipe).populate('UserId')
  }
  const removeAccount = (pipe) => {
    return Account.deleteMany(pipe)
  }
  return {
    getAccountNoPaging,
    removeAccount,
    addAccount,
    getAccountAgg,
    getAccountById,
    deleteAccount,
    updateAccount,
    checkIdExist,
    getCount,
    getAccount,
    getAccountFindOne
  }
}
