module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
    const { ObjectId } = mongoose.Types
    const accountType = {
        GOOGLE: 1,
        MICROSOFT: 2
    }
    const accountJoi = joi.object({
        userId: joi.string().required(),
        type: joi.number().valid(...Object.values(accountType)).default(1),
        refreshToken: joi.string().required(),
        accessToken: joi.string().required()
    })
    const accountSchema = joi2MongoSchema(accountJoi, {
        userId: {
            account: ObjectId,
            ref: 'User'
        }
    }, {
        createdAt: {
            account: Number,
            default: () => Math.floor(Date.now() / 1000)
        }
    })
    accountSchema.statics.validateObj = (obj, config = {}) => {
        return accountJoi.validate(obj, config)
    }
    const accountModel = mongoose.model('Account', accountSchema)
    accountModel.syncIndexes()
    return accountModel
}
