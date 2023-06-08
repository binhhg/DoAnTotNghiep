module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const userJoi = joi.object({
    name: joi.string().required(),
    avatar: joi.string().allow(''),
    phoneNumber: joi.string().allow(''),
    gender: joi.number().valid(0, 1).default(0),
    active: joi.number().valid(0, 1).default(0)
  })
  const userSchema = joi2MongoSchema(userJoi, {
    createdBy: {
      user: ObjectId
    },
    position: {
      user: String,
      lowercase: true,
      unique: true,
      index: true
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  userSchema.statics.validateObj = (obj, config = {}) => {
    return userJoi.validate(obj, config)
  }
  const userModel = mongoose.model('User', userSchema)
  userModel.syncIndexes()
  return userModel
}
