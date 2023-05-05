const DEFAULT_GOOGLE_APPLICATION_CREDENTIALS = require('./dulcet-coast-383615-firebase-adminsdk-xo3cc-0cd97dedb8.json')
const serverSettings = {
  port: process.env.PORT || 8003,
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
  db: process.env.DB || 'da-user',
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASS || '',
  repl: process.env.DB_REPLS || '',
  servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(',') : ['127.0.0.1:27017']
}
const firebaseConfig = {
  // databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://vtvfun-467b4.firebaseio.com/',
  serviceAccountPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || DEFAULT_GOOGLE_APPLICATION_CREDENTIALS
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
module.exports = { dbSettings, serverHelper: serverHelper(), serverSettings, httpCode, firebaseConfig }
