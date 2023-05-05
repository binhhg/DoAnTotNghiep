module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      User
    }
  } = container.resolve('models')
  const { httpCode, serverHelper } = container.resolve('config')
  const firebaseAdmin = container.resolve('firebaseAdmin')
  const { typeRepo } = container.resolve('repo')
  const loginOrRegister = async (req, res) => {
    try {
      const {
        token, method, code, domain
      } = req.body
      const decodeUser = await firebaseAdmin.auth().verifyIdToken(token.trim())
      res.status(httpCode.CREATED).json({ ok: true })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const firebaseCallback = async (req, res) => {
    try {
      const cc = req.query
      const dd = req.body
      console.log(cc,dd)
      res.status(httpCode.SUCCESS).json({ ok: true })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }

  return {
    loginOrRegister,
    firebaseCallback
  }
}
