const axios = require('axios')
module.exports = (container) => {
  const {
    serverHelper,
    httpCode
  } = container.resolve('config')
  const logger = container.resolve('logger')
  const verifyAccessTokenB2 = async (req, res, next) => {
    try {
      return authenWithAuthorizationServiceB2(req, res, next)
    } catch (e) {
      if (!e.message.includes('TokenExpiredError')) {
        logger.e(e)
      }
      res.status(httpCode.TOKEN_EXPIRED).json({})
    }
  }
  const verifyAccessTokenB1 = async (req, res, next) => {
    try {
      const token = req.headers['x-access-token'] || ''
      if (!token) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Bạn không có quyền thực hiện tác vụ này.' })
      }
      const user = await serverHelper.verifyToken(token)
      const { path } = req
      const option = {
        url: process.env.AUTHORIZATION_URL || 'http://localhost:8301/authorization',
        data: {
          userId: user._id,
          path,
          method: req.method
        },
        headers: {
          'x-access-token': token
        },
        method: 'POST'
      }
      const {
        data: {
          ok,
          msg,
          user: userAuthorization
        }
      } = await axios(option)
      if (ok) {
        req.user = userAuthorization
        if (userAuthorization.readonly && req.method !== 'GET') {
          return res.status(httpCode.BAD_REQUEST).json({ msg: 'Bạn chỉ có quyền xem thông tin, không thể thực hiện được thao tác này.' })
        }
        return next()
      }
      res.status(httpCode.BAD_REQUEST).json({ msg: msg || 'Bạn không có quyền thực hiện tác vụ này.' })
    } catch (e) {
      if (!e.message.includes('TokenExpiredError')) {
        logger.e(e)
      }
      res.status(httpCode.TOKEN_EXPIRED).json({})
    }
  }
  const authenWithAuthorizationServiceB2 = async (req, res, next) => {
    try {
      const token = req.headers['x-access-token'] || ''
      if (!token) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Bạn không có quyền thực hiện tác vụ này.' })
      }
      const user = await serverHelper.verifyToken(token)
      req.userFromToken = user
      const { path } = req

      const option = {
        url: process.env.AUTHORIZATION_B2_URL || 'http://maybinh:8303/authorization',
        data: {
          userId: user._id,
          path,
          method: req.method
        },
        headers: {
          'x-access-token': token
        },
        method: 'POST'
      }
      const data = await axios(option)
      const {
        status,
        data: {
          ok,
          msg,
          user: userAuthorization
        }
      } = data
      if (ok && status === httpCode.SUCCESS) {
        req.user = userAuthorization
        if (req.user.idCongTy !== String(userAuthorization.idCongTy)) {
          return res.status(httpCode.UNAUTHORIZED).json({})
        }
        if (userAuthorization.readonly && req.method !== 'GET') {
          return res.status(httpCode.BAD_REQUEST).json({ msg: 'Bạn chỉ có quyền xem thông tin, không thể thực hiện được thao tác này.' })
        }
        if (req.method === 'GET') {
          req.query.company = userAuthorization.idCongTy
        } else {
          req.body.company = userAuthorization.idCongTy
        }
        return next()
      } else if (ok && status === httpCode.TOKEN_EXPIRED) {
        res.status(httpCode.TOKEN_EXPIRED).json({ msg: 'Phiên đăng nhập hết hạn' })
      }
      res.status(httpCode.BAD_REQUEST).json({ msg: msg || 'Bạn không có quyền thực hiện tác vụ này.' })
    } catch (e) {
      if (!e.message.includes('TokenExpiredError')) {
        logger.e(e)
      }
      res.status(httpCode.TOKEN_EXPIRED).json({})
    }
  }
  const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN || '123'
  const verifyInternalToken = async (req, res, next) => {
    const token = req.headers['x-access-token']
    if (token !== INTERNAL_TOKEN) {
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'Bạn không có quyền thực hiện tác vụ này!' })
    }
    return next()
  }
  return { verifyAccessTokenB2, verifyAccessTokenB1, verifyInternalToken }
}
