module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Account
    }
  } = container.resolve('models')
  const { httpCode, serverHelper } = container.resolve('config')
  const { accountRepo, userRepo, configRepo } = container.resolve('repo')
  const processLoginGoogle2 = async (account, profile, userId) => {
    try {
      const { sub } = profile
      const acc = await accountRepo.getAccountFindOne({ id: sub }).lean()
      if (acc) {
        return { ok: false, msg: 'Tài khoản đã được sử dụng' }
      }
      const acco = await accountRepo.addAccount({
        id: profile.sub,
        provider: 1,
        userId: userId,
        photo: profile.picture || '',
        refreshToken: account.refresh_token,
        email: profile.email
      })
      await configRepo.updateOne({ userId: userId }, {
        $push: {
          accountColor: {
            $each: [{
              provider: 1,
              email: acco.email,
              accountId: acco._id,
              color: '#F4511E'
            }],
            $sort: { provider: 1 }
          }
        }
      })
      return { ok: true }
    } catch (e) {
      console.log(e)
      return { ok: false, msg: 'Lỗi rồi ' }
    }
  }
  const addAccount = async (req, res) => {
    try {
      const { userId } = req.user
      const { account, profile, loginType } = req.body
      if (loginType === 1) {
        const user = await processLoginGoogle2(account, profile, userId)
        if (user.ok) {
          return res.status(httpCode.SUCCESS).json({ ok: true })
        }
        return res.status(httpCode.BAD_REQUEST).json({ ok: false, msg: 'tài khoản đã được liên kết' })
      }
      res.status(httpCode.SUCCESS).json({ ok: true })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ ok: false })
    }
  }
  const deleteAccountById = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        await accountRepo.deleteAccount(id)
        res.status(httpCode.SUCCESS).send({ ok: true })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getAccountById = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const account = await accountRepo.getAccountById(id)
        res.status(httpCode.SUCCESS).send(account)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getAccount = async (req, res) => {
    try {
      const { userId } = req.user
      const data = await accountRepo.getAccountNoPaging({ userId: userId })
      res.status(httpCode.SUCCESS).json(data)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getAccountProfile = async (req, res) => {
    try {
      const { userId } = req.user
      const data = await accountRepo.getAccountProfile({ userId: userId })
      res.status(httpCode.SUCCESS).json(data)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  return {
    addAccount,
    getAccount,
    deleteAccountById,
    getAccountById,
    getAccountProfile
  }
}
