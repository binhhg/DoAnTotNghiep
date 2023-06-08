module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const stateConfig = {
    NORMAL: 1,
    MEDIUM: 2,
    IMPORTANT: 3
  }
  const eventJoi = joi.object({
    userId: joi.string().required(),
    title: joi.string().required(),
    description: joi.string().allow(''),
    location: joi.string().allow(''),
    start: joi.number(),
    end: joi.number(),
    rrule: joi.object().unknown(),
    exdate: joi.string().allow(''),
    duration: joi.string().allow(''),
    state: joi.number().valid(...Object.values(stateConfig)).default(1)
  })
  const eventSchema = joi2MongoSchema(eventJoi, {
    userId: {
      type: ObjectId
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  eventSchema.statics.validateObj = (obj, config = {}) => {
    return eventJoi.validate(obj, config)
  }
  const eventModel = mongoose.model('Event', eventSchema)
  eventModel.syncIndexes()
  return eventModel
}
