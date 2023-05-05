module.exports = (container) => {
  const accountController = require('./accountController')(container)
  const userController = require('./userController')(container)
  return {
    userController,accountController
  }
}
