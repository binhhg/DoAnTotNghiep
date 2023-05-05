module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const stateConfig = {
    NORMAL: 1,
    MEDIUM: 2,
    IMPORTANT: 3
  }
  const eventJoi = joi.object({
    title: joi.string().required(),
    userId: joi.string().required,
    summary: joi.string.allow(''),
    start: joi.number(),
    end: joi.number(),
    location: joi.string().allow(''),
    state: joi.number().valid(...Object.values(stateConfig)).default(1),
    recurrence: joi.array().items(joi.string().allow('')).default([]),
    isBooking: joi.number().valid(0, 1).default(0)
  })
  const eventSchema = joi2MongoSchema(eventJoi, {
    userId: {
      event: ObjectId,
      ref: 'User'
    }
  }, {
    createdAt: {
      event: Number,
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
