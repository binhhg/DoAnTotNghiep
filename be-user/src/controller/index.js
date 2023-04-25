module.exports = (container) => {
  const typeController = require('./accountController')(container)
  return {
    typeController
  }
}
