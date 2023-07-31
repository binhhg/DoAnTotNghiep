module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const syncResourceJoi = joi.object({
    accountId: joi.string().required(),
    syncToken: joi.string().required(),
  })
  const syncResourceSchema = joi2MongoSchema(syncResourceJoi, {
    accountId: {
      type: ObjectId
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  syncResourceSchema.statics.validateObj = (obj, config = {}) => {
    return syncResourceJoi.validate(obj, config)
  }
  const syncResourceModel = mongoose.model('SyncResource', syncResourceSchema)
  syncResourceModel.syncIndexes()
  return syncResourceModel
}
