module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const stateConfig = {
    NORMAL: 1,
    MEDIUM: 2,
    IMPORTANT: 3
  }
  const accountType = {
    GOOGLE: 1,
    MICROSOFT: 2
  }
  const responseStatusConfig = {
    TENTATIVE: 1,
    NOT_ACCEPTED: 2,
    ACCEPTED: 3
  }
  const eventJoi = joi.object({
    eventId: joi.string().required(),
    type: joi.number().valid(...Object.values(accountType)).default(1),
    accountId: joi.string().required(),
    attendees: joi.object({
      email: joi.string().required(),
      responseStatus: joi.number().valid(...Object.values(responseStatusConfig)).default('')
    }),
    attachments: joi.array().items(joi.string().allow('')).default([]),
    linkMeeting: joi.string().allow(''),
    createdBy: joi.string().allow('')
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
