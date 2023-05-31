module.exports = (container) => {
  const accountController = require('./accountController')(container)
  const userController = require('./userController')(container)
  const hookController = require('./hookController')(container)
  return {
    userController,accountController,hookController
  }
}
