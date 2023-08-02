module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      User
    }
  } = container.resolve('models')
  const actionConfig = {
    ADD_GOOGLE: 'add-google',
    DEL_GOOGLE: 'del-google'
  }
  const { httpCode, serverHelper } = container.resolve('config')
  const mediator = container.resolve('mediator')
  const { accountRepo, userRepo, sessionRepo, configRepo } = container.resolve('repo')
  const { googleHelper } = container.resolve('helper')
  const processLoginGoogle = async (code) => {
    const { tokens } = await googleHelper.getToken(code)
    if (tokens) {
      const { data } = await googleHelper.getUserInfo(tokens.id_token)
      if (data) {
        let account = await accountRepo.getAccountFindOne({ id: data.id }).lean()
        let user
        if (!account) {
          const u = {
            name: data.name,
            avatar: data.photo || ''
          }
          user = await userRepo.addUser(u)
          const a = {
            id: data.id,
            provider: 1,
            userId: user._id,
            photo: data.photo || '',
            refreshToken: tokens.refresh_token,
            email: data.email
          }
          account = await accountRepo.addAccount(a)
        } else {
          if (tokens.refresh_token) {  // nghĩa là nó đã xóa quyền truy cập hoặc refresh token hết hạn nên khi login nó sẽ cấp lại cái refresh này
            await accountRepo.updateAccount(account._id, {
              refreshToken: tokens.refresh_token
            })
          }
          user = account.userId
        }
        const token = serverHelper.genToken({
          name: user.name,
          avatar: user.avatar,
          loginType: 1,
          id: account.id,
          userId: user._id.toString()
        })
        const hash = serverHelper.generateHash(token)
        const sess = {
          id: account.id,
          userId: user._id.toString()
        }
        const { exp } = serverHelper.decodeToken(token)
        sess.hash = hash
        sess.expireAt = exp
        await sessionRepo.createSession(sess)
        return { token, user, ok: true }
      }
      return { ok: false, msg: '58' }
    }
    return { ok: false, msg: '60' }
  }
  const processLoginGoogle2 = async (account, profile) => {
    try {
      const { sub } = profile
      let acc = await accountRepo.getAccountFindOne({ id: sub }).lean()
      let user
      if (!acc) {
        user = await userRepo.addUser({
          name: profile.name,
          avatar: profile.picture
        })
        acc = await accountRepo.addAccount({
          id: profile.sub,
          provider: 1,
          userId: user._id,
          photo: profile.picture || '',
          refreshToken: account.refresh_token,
          email: profile.email
        })
        setTimeout(() => {
          mediator.emit('watch',{
            action: actionConfig.ADD_GOOGLE,
            token: account.refresh_token,
            id: acc._id.toString()
          })
        }, 1)
        const qq = {
          userId: (user._id).toString(),
          defaultColor: '#73BBAB',
          accountColor: [{ provider: 1, email: acc.email, accountId: (acc._id).toString(), color: '#F4511E' }]
        }
        const { value, error } = await schemaValidator(qq, 'Config')
        if (error) {
          return { ok: false, msg: 'valid' }
        }
        await configRepo.addConfig(value)
      } else {
        if (account.refresh_token !== acc.refreshToken) {
          await accountRepo.updateAccount(acc._id, {
            refreshToken: account.refresh_token
          })
          console.log('vao day ne')
        }
        user = acc.userId
      }
      const token = serverHelper.genToken({
        name: user.name,
        avatar: user.avatar,
        loginType: 1,
        id: acc.id,
        userId: user._id.toString()
      })
      const hash = serverHelper.generateHash(token)
      const sess = {
        id: acc.id,
        userId: user._id.toString()
      }
      const { exp } = serverHelper.decodeToken(token)
      sess.hash = hash
      sess.expireAt = exp
      await sessionRepo.createSession(sess)
      return { token, user, ok: true }
    } catch (e) {
      return { ok: false }
    }
  }
  const generateUrl = async (req, res) => {
    try {
      const data = await googleHelper.generateAuthUrl()
      if (data.ok) {
        return res.status(httpCode.SUCCESS).json({ url: data.url })
      }
      res.status(httpCode.BAD_REQUEST).json()
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json()
    }
  }
  const loginOrRegister = async (req, res) => {
    try {
      const { code, type } = req.body
      if (type === 'GOOGLE') {
        const user = await processLoginGoogle(code)
        if (user.ok) {
          return res.status(httpCode.SUCCESS).json(user)
        }
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'loi trong qua trinh dang nhap' })
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'phuong thuc dang nhap khong dung' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json()
    }
  }
  const refreshToken = async (req, res) => {
    try {
      const token = req.headers['x-access-token']
      if (token) {
        const user = serverHelper.decodeToken(token)
        if (!user) {
          return res.status(httpCode.UNAUTHORIZED).json({ ok: false })
        }
        const hash = serverHelper.generateHash(token)
        const sess = await sessionRepo.findOne({ hash })
        if (sess) {
          const { expireAt, userId, id } = sess
          if (serverHelper.canRefreshToken(expireAt)) {
            const u = await userRepo.getUserById(userId)
            if (u) {
              const token = serverHelper.genToken({
                name: user.name,
                avatar: user.avatar,
                loginType: 1,
                id,
                userId
              })
              await sessionRepo.deleteOne({ hash })
              const hash1 = serverHelper.generateHash(token)
              const { exp } = serverHelper.decodeToken(token)
              sess.hash = hash1
              sess.expireAt = exp
              sess.updateAt = Math.floor(Date.now() / 1000)
              sess.save()
              await sessionRepo.createSession(sess)
              return res.status(httpCode.SUCCESS).json({ ok: true, token })
            }
          }
        }
      }
      res.status(httpCode.UNAUTHORIZED).json({ ok: false })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json()
    }
  }
  const logout = async (req, res) => {
    try {
      const token = req.headers['x-access-token']
      const user = serverHelper.decodeToken(token)
      if (user) {
        const hash = serverHelper.generateHash(token)
        await sessionRepo.removeSession({
          userId: user.userId,
          hash
        })
      }
      res.status(httpCode.SUCCESS).json({ ok: true })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json()
    }
  }
  const login = async (req, res) => {
    try {
      const { account, profile, loginType } = req.body
      console.log(req.body)
      if (loginType === 1) {
        const user = await processLoginGoogle2(account, profile)
        if (user.ok) {
          return res.status(httpCode.SUCCESS).json(user)
        }
        return res.status(httpCode.BAD_REQUEST).json({ ok: false })
      }
      res.status(httpCode.SUCCESS).json({ ok: true })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json()
    }
  }
  const getUser = async (req, res) => {
    try {
      const { userId } = req.user
      const data = await userRepo.getUserById(userId)
      res.status(httpCode.SUCCESS).json(data)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateInfo = async (req, res) => {
    try {
      const { userId } = req.user
      const body = req.body
      const up = await userRepo.updateUser(userId, body)
      res.status(httpCode.SUCCESS).json({ ok: true, data: up })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  return {
    loginOrRegister,
    generateUrl,
    refreshToken,
    logout,
    login,
    getUser,
    updateInfo
  }
}
