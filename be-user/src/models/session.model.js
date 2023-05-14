module.exports = (joi, mongoose) => {
    const sessionSchema = mongoose.Schema({
        createdAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
        authTime: { type: Number },
        id: { type: String, index: true },
        deviceType: { type: Number },
        hash: { type: String, index: true },
        expireAt: { type: Number }
    })
    return mongoose.model('session', sessionSchema)
}
