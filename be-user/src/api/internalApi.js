module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { userController, accountController } = container.resolve('controller')
  const { verifyInternalToken } = container.resolve('middleware')
  const { basePath } = serverSettings
  app.get(`${basePath}/internal/account/:id`, verifyInternalToken, accountController.getAccountById)
}
