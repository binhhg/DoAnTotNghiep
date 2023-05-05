module.exports = (container) => {
  const userHelper = require('./userHelper')(container)
  const googleHelper = require('./googleHelper')(container)
  return { userHelper,googleHelper }
}
