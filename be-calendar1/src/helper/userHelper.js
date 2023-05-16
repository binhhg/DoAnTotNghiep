const axios = require('axios')
module.exports = container => {
  const { urlConfig: { user }, httpCode } = container.resolve('config')
  const logger = container.resolve('logger')
  const accessToken = process.env.INTERNAL_TOKEN || '123'
  const getAccountById = async (id) => {
    try {
      const options = {
        headers: { 'x-access-token': accessToken },
        uri: `${user}/internal/user/${id}`,
        json: true,
        method: 'GET'
      }
      const data = await axios(options)
      return { statusCode: httpCode.SUCCESS, data }
    } catch (e) {
      logger.e(e?.response?.data)
      return { statusCode: httpCode.BAD_REQUEST, msg: e?.response?.data }
    }
  }
  return {
    getAccountById
  }
}
