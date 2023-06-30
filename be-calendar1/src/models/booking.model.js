module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const accountType = {
    GOOGLE: 1,
    MICROSOFT: 2
  }
  const responseStatusConfig = {
    NEEDSACTION: 1, // chua lam gi
    TENTATIVE: 1, // co the
    DECLINED: 2, // tu choi
    ACCEPTED: 3 // dong y
  }
  const eventJoi = joi.object({
    calendarId: joi.string().required(),
    eventId: joi.string().required(),
    type: joi.number().valid(...Object.values(accountType)).default(1),
    userId: joi.string().required(),
    accountId: joi.string().required(),
    attendees: joi.array().items(joi.object().unknown()).default([]),
    attachments: joi.array().items(joi.string().allow('')).default([]),
    hangoutLink: joi.string().allow(''),
    recurrence: joi.array().items(joi.string().allow('')).default([]),
    createdBy: joi.object().default({}).unknown(),
    organizer: joi.object().default({}).unknown(),
    originalStartTime: joi.object().default({}).unknown(),
    recurringEventId: joi.string().default(''),
    sequence: joi.number().default(0) // dùng khi update cần truyền lên để tránh conflict
  })
  const eventSchema = joi2MongoSchema(eventJoi, {
    userId: {
      type: ObjectId
    },
    accountId: {
      type: ObjectId
    },
    eventId: {
      type: ObjectId,
      ref: 'Event'
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
  const eventModel = mongoose.model('Booking', eventSchema)
  eventModel.syncIndexes()
  return eventModel
}
