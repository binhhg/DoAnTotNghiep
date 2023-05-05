module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const attendeeJoi = joi.object({
    userId: joi.string().required(),
    email: joi.string().allow('')
  })
  const attendeeSchema = joi2MongoSchema(attendeeJoi, {
    userId: {
      type: ObjectId
    }
  }, {
    createdAt: {
      attendee: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  attendeeSchema.statics.validateObj = (obj, config = {}) => {
    return attendeeJoi.validate(obj, config)
  }
  const attendeeModel = mongoose.model('Attendee', attendeeSchema)
  attendeeModel.syncIndexes()
  return attendeeModel
}
