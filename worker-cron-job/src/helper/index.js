module.exports = (container) => {
  const googleHelper = require('./googleHelper')(container)
  const userHelper = require('./userHelper')(container)
  return { googleHelper, userHelper }
}
