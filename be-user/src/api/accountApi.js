module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { accountController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')
  const { basePath } = serverSettings
  app.post(`${basePath}/account`, verifyToken, accountController.addAccount)
  app.get(`${basePath}/account`, verifyToken, accountController.getAccount)
  app.get(`${basePath}/account/profile`, verifyToken, accountController.getAccountProfile)
  app.delete(`${basePath}/account`, verifyToken, accountController.deleteAccountById)
}
