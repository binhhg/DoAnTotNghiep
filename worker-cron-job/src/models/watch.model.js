module.exports = (joi, mongoose) => {
  const schema = new mongoose.Schema({}, { strict: false })
  return mongoose.model('Watch', schema)
}
