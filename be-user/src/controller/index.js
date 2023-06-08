module.exports = (container) => {
  const accountController = require('./accountController')(container)
  const userController = require('./userController')(container)
  const hookController = require('./hookController')(container)
  const configController = require('./configController')(container)
  return {
    userController, accountController, hookController, configController
  }
}
