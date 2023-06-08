module.exports = (joi, mongoose) => {
  const sessionSchema = mongoose.Schema({
    createdAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    userId: { type: String, index: true },
    hash: { type: String, index: true },
    id: { type: String },
    expireAt: { type: Number }
  })
  return mongoose.model('session', sessionSchema)
}
