module.exports = container => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')

  const { httpCode, eventConfig, actionConfig } = container.resolve('config')

  const hook = async (req, res) => {
    try {
      const body = req.body
      const headers = req.headers
      console.log('body', body)
      console.log('headers', headers)
      res.status(httpCode.SUCCESS).json({ ok: true })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  return { hook }
}
