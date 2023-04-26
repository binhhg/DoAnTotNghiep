module.exports = (container) => {
    const logger = container.resolve('logger')
    const ObjectId = container.resolve('ObjectId')
    const {
        schemaValidator,
        schemas: {
            User
        }
    } = container.resolve('models')
    const {httpCode, serverHelper} = container.resolve('config')
    const firebaseAdmin = container.resolve('firebaseAdmin')
    const {typeRepo} = container.resolve('repo')
    const loginOrRegister = async (req, res) => {
        try {
            let {
                token, method, code, domain
            } = req.body
            const {
                error,
                value
            } = await schemaValidator(body, 'Type')
            if (error) {
                return res.status(httpCode.BAD_REQUEST).json({msg: error.message})
            }
            const type = await typeRepo.addType(value)
            res.status(httpCode.CREATED).json(type)
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).end()
        }
    }

    return {
        loginOrRegister,
    }
}
