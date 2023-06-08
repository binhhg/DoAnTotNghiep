module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const accountType = {
    GOOGLE: 1,
    MICROSOFT: 2
  }
  const configJoi = joi.object({
    userId: joi.string().required(),
    defaultColor: joi.string().required().default('blue'),
    accountColor: joi.array().items(joi.object({
      provider: joi.number().valid(...Object.values(accountType)).default(accountType.GOOGLE),
      accountId: joi.string().required(),
      email: joi.string().required(),
      color: joi.string().required()
    }))
  })
  const configSchema = joi2MongoSchema(configJoi, {
    userId: {
      type: ObjectId,
      ref: 'User'
    },
    accountColor: [{
      provider: Number,
      email: String,
      accountId: {
        type: ObjectId,
        ref: 'Account'
      },
      color: String
    }]
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  configSchema.statics.validateObj = (obj, config = {}) => {
    return configJoi.validate(obj, config)
  }
  const configModel = mongoose.model('Config', configSchema)
  configModel.syncIndexes()
  return configModel
}
