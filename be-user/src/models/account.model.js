module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const accountType = {
    GOOGLE: 1,
    MICROSOFT: 2
  }
  const accountJoi = joi.object({
    id: joi.string().required(),
    userId: joi.string().required(),
    provider: joi.number().valid(...Object.values(accountType)).default(1),
    refreshToken: joi.string().required(),
    email: joi.string().required(),
    photo: joi.string().allow('')
  })
  const accountSchema = joi2MongoSchema(accountJoi, {
    userId: {
      type: ObjectId,
      ref: 'User'
    },
    id: {
      unique: true,
      index: true
    }
  }, {
    createdAt: {
      type: Number,
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
