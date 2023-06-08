module.exports = container => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Config
    }
  } = container.resolve('models')
  const { httpCode, serverHelper } = container.resolve('config')
  const { configRepo, accountRepo } = container.resolve('repo')
  const getConfigUser = async (req, res) => {
    try {
      const userId = req.user
      const data = await configRepo.getConfigFindOne({ userId: ObjectId(userId) })
      if (data) {
        return res.status(httpCode.SUCCESS).json(data)
      }
      const account = await accountRepo.getAccountSortProvider({ userId: ObjectId(userId) }).lean()
      if (!account || !account.length) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'loi roi k co account' })
      }
      const qq = {
        userId,
        defaultColor: '#73BBAB',
        accountColor: []
      }
      for (const value of account) {
        qq.accountColor.push({ provider: value.provider, email: value.email, accountId: value._id, color: '#F4511E' })
      }
      const { value, error } = await schemaValidator(qq, 'Config')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'loi roi k co account' })
      }
      const result = await configRepo.addConfig(value)
      res.status(httpCode.SUCCESS).json(result)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const changeColorUser = async (req, res) => {
    try {
      const { userId } = req.user
      const { defaultColor, accountColor } = req.body
      res.status(httpCode.SUCCESS).json({})
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  return {
    getConfigUser,
    changeColorUser
  }
}
