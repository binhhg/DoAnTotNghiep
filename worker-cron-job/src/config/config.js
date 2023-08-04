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
const urlConfig = {
  user: process.env.USER_URL || 'http://localhost:8501'
}

const dbSettings = {
  db: process.env.DB || 'da-watch',
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASS || '',
  repl: process.env.DB_REPLS || '',
  servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(',') : ['mayhao:27017']
}

const serverHelper = function () {
  const cronJob = require('cron').CronJob
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

  function stringToSnakeCase (str) {
    const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ'
    const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy'
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(RegExp(from[i], 'gi'), to[i])
    }

    str = str.toLowerCase().trim()
      .replace(/[^a-z0-9 \_]/g, '')
      .replace(/ +/g, '_')

    return str
  }

  function underScoreToCamelCase (obj) {
    return camelcaseKeys(obj, { deep: true })
  }

  function encryptPassword (password) {
    return crypto.createHash('sha256').update(password, 'binary').digest('base64')
  }

  function replaceMongoDbId (obj) {
    const result = {}
    Object.keys(obj).forEach(key => {
      if (key === '_id') {
        result.mongoId = obj[key]
      } else if (obj[key] && obj[key].constructor === Object) {
        result[key] = replaceMongoDbId(obj[key])
      } else if (obj[key] && obj[key].constructor === Array) {
        const arr = obj[key]
        for (const i in arr) {
          const o = arr[i]
          if (o.constructor === Object) {
            const objRM = replaceMongoDbId(o)
            arr[i] = objRM
          }
        }
        result[key] = arr
      } else {
        result[key] = obj[key]
      }
    })
    return result
  }

  return { stringToSnakeCase, decodeToken, encryptPassword, verifyToken, genToken, underScoreToCamelCase, replaceMongoDbId, cronJob }
}
module.exports = {
  dbSettings,
  serverHelper: serverHelper(),
  serverSettings,
  httpCode,
  urlConfig
}
