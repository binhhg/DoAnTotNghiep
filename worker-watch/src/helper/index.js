module.exports = (container) => {
  const googleHelper = require('./googleHelper')(container)
  return { googleHelper }
}
