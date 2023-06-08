const axios = require('axios')
module.exports = (container) => {
  const {
    serverHelper,
    httpCode
  } = container.resolve('config')
  const logger = container.resolve('logger')
  const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN || '123'
  const verifyToken = async (req, res, next) => {
    try {
      // return next()
      const token = req.headers['x-access-token'] || ''
      if (!token) {
        return res.status(httpCode.UNAUTHORIZED).json({ msg: 'invalid token' })
      }
      const user = await serverHelper.verifyToken(token)
      req.user = user
      return next()
    } catch (e) {
      // logger.e(e)
      res.status(httpCode.TOKEN_EXPIRED).json({ msg: 'token expired' })
    }
  }
  const verifyInternalToken = async (req, res, next) => {
    const token = req.headers['x-access-token']
    if (token !== INTERNAL_TOKEN) {
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'Bạn không có quyền thực hiện tác vụ này!' })
    }
    return next()
  }
  return { verifyToken, verifyInternalToken }
}
