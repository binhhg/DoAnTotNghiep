module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const accountJoi = joi.object({
    id: joi.string().required(),
    kind: joi.string().required(),
    resourceId: joi.string().required(),
    resourceUri: joi.string().allow(''),
    token: joi.string().allow(''),
    expiration: joi.string().allow('')
  })
  const accountSchema = joi2MongoSchema(accountJoi, {
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
  const accountModel = mongoose.model('Watch', accountSchema)
  accountModel.syncIndexes()
  return accountModel
}
