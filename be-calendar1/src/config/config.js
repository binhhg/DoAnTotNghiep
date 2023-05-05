const DEFAULT_GOOGLE_APPLICATION_CREDENTIALS = require.resolve('./ecommerce-b226b-firebase-adminsdk-1j2vk-e5ab7031ea.json')
const serverSettings = {
  port: process.env.PORT || 8305,
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
  servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(',') : ['localhost:27017']
}
const firebaseConfig = {
  // databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://vtvfun-467b4.firebaseio.com/',
  serviceAccountPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || DEFAULT_GOOGLE_APPLICATION_CREDENTIALS
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
const eventConfig = {
  GOOGLE_CALENDAR: 'google-calendar'
}
const actionConfig = {
  CREATE: 'create',
  UPDATE: 'updated',
  DELETE: 'deleted'
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
module.exports = { dbSettings, serverHelper: serverHelper(), serverSettings, httpCode, firebaseConfig, rabbitConfig,workerConfig,actionConfig,eventConfig }
