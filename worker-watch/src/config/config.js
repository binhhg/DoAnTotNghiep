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
const dbSettings = {
  db: process.env.DB || 'da-watch',
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASS || '',
  repl: process.env.DB_REPLS || '',
  servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(',') : ['mayhao:27017']
}
const rabbitConfig = {
  host: process.env.RABBIT_HOST || 'mayhao',
  port: process.env.RABBIT_PORT || 5672,
  user: process.env.RABBIT_USER || 'wilad',
  pass: process.env.RABBIT_PASS || 'wilad0304'
}
const workerConfig = {
  queueName: 'watch.google',
  exchange: 'watch',
  exchangeType: 'direct'
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
  urlConfig,
  dbSettings
}
