const serverSettings = {
  port: process.env.PORT || 8503,
  basePath: process.env.BASE_PATH || ''
}

const httpCode = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  TOKEN_EXPIRED: 409,
  UNKNOWN_ERROR: 520,
  FORBIDDEN: 403,
  ADMIN_REQUIRE: 406,
  UNAUTHORIZED: 401
}

const dbSettings = {
  db: process.env.DB || 'da-calendar',
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
  queueName: process.env.QUEUE_NAME || 'da.google',
  exchange: process.env.EXCHANGE_NAME || 'da:push',
  exchangeType: process.env.EXCHANGE_TYPE || 'direct'
}
const eventConfig = {
  GOOGLE_CALENDAR: 'google-calendar'
}
const actionConfig = {
  CREATE: 'create',
  UPDATE: 'updated',
  DELETE: 'deleted'
}
const urlConfig = {
  user: process.env.USER_URL || 'http://localhost:8501'
}
const serverHelper = function () {
  const jwt = require('jsonwebtoken')
  const crypto = require('crypto')
  const secretKey = process.env.SECRET_B2_KEY || '112customer#$!@!'

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

  function encryptPassword (password) {
    return crypto.createHash('sha256').update(password, 'binary').digest('base64')
  }

  return { decodeToken, encryptPassword, verifyToken, genToken }
}
module.exports = {
  dbSettings,
  serverHelper: serverHelper(),
  serverSettings,
  httpCode,
  rabbitConfig,
  workerConfig,
  actionConfig,
  eventConfig,
  urlConfig
}
