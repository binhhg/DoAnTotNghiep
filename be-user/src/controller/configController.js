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
      const { userId } = req.user
      const data = await configRepo.getConfigFindOne({ userId: userId })
      if (data) {
        return res.status(httpCode.SUCCESS).json(data)
      }
      const account = await accountRepo.getAccountSortProvider({ userId: userId }).lean()
      if (!account || !account.length) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'loi roi k co account' })
      }
      const qq = {
        userId,
        defaultColor: '#73BBAB',
        accountColor: []
      }
      for (const value of account) {
        qq.accountColor.push({
          provider: value.provider,
          email: value.email,
          accountId: value._id,
          color: '#F4511E'
        })
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
      const { dataChange } = req.body
      const config = await configRepo.getConfigFindOne({ userId: userId }).lean()
      if (!config) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'co loi xay ra' })
      }
      if (dataChange._id === 'defaultId') {
        config.defaultColor = dataChange.color
      } else {
        const { accountColor } = config
        for (const va of accountColor) {
          if (va._id.toString() === dataChange._id) {
            va.color = dataChange.color
            break
          }
        }
      }
      const result = await configRepo.updateConfig(config._id, config)
      res.status(httpCode.SUCCESS).json(result)
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
