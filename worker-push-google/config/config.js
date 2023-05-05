require('dotenv').config()

const serverSettings = {
  port: process.env.PORT || 8004, basePath: process.env.BASE_PATH || ''
}

const httpCode = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  TOKEN_EXPIRED: 409,
  UNKNOWN_ERROR: 520,
  FORBIDDEN: 403,
  ADMIN_REQUIRE: 406
}

const rabbitConfig = {
  host: process.env.RABBIT_HOST || 'localhost',
  port: process.env.RABBIT_PORT || 5672,
  user: process.env.RABBIT_USER || 'abcd',
  pass: process.env.RABBIT_PASS || 'abcd2000'
}
const workerConfig = {
  queueName: process.env.QUEUE_NAME || 'da.google',
  exchange: process.env.EXCHANGE_NAME || 'da:push',
  exchangeType: process.env.EXCHANGE_TYPE || 'direct'
}
const serverHelper = function () {
  const jwt = require('jsonwebtoken')
  const crypto = require('crypto')
  const camelcaseKeys = require('camelcase-keys')
  const secretKey = process.env.SECRET_KEY || '112customer#$!@!'

  function decodeToken (token) {
    return jwt.decode(token)
  }
  function genToken (obj) {
    return jwt.sign(obj, secretKey, { expiresIn: '1d' })
  }

  function verifyToken (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        err ? reject(new Error(err)) : resolve(decoded)
      })
    })
  }

  function underScoreToCamelCase (obj) {
    return camelcaseKeys(obj, { deep: true })
  }

  function encryptPassword (password) {
    return crypto.createHash('sha256').update(password, 'binary').digest('base64')
  }

  return { decodeToken, encryptPassword, verifyToken, genToken, underScoreToCamelCase, }
}
const urlConfig = {
  userUrl: process.env.USER_URL || 'http://localhost:8000'
}
module.exports = {
  serverHelper: serverHelper(),
  serverSettings,
  httpCode,
  rabbitConfig,
  workerConfig,
  urlConfig
}
