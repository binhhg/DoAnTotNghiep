const axios = require('axios').default

module.exports = (container) => {
  const { urlConfig: { userUrl }, httpCode } = container.resolve('config')
  const accessToken = process.env.INTERNAL_TOKEN || 'abcd123'
  const logger = container.resolve('logger')
  const getAccount = async (id) => {
    try {
      const options = {
        headers: { 'x-access-token': accessToken },
        url: `${userUrl}/internal/account/${id}`,
        json: true,
      }
      const { data } = await axios(options)
      return { statusCode: httpCode.SUCCESS, data }
    } catch (e) {
      const { name, statusCode, error } = e
      if (name === 'StatusCodeError') {
        return { data: error, statusCode, msg: (error || {}).msg || '' }
      }
      logger.e(e?.response?.data)
      return { statusCode: httpCode.BAD_REQUEST, msg: e?.response?.data }
    }
  }

  return {
    getAccount
  }
}
