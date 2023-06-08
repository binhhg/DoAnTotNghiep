module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { configController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')
  const { basePath } = serverSettings
  app.get(`${basePath}/config`, verifyToken, configController.getConfigUser)
  app.put(`${basePath}/config`, verifyToken, configController.changeColorUser)
}
