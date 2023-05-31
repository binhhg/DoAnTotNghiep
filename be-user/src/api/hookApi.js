module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { hookController } = container.resolve('controller')
  app.post(`${basePath}/hookTest`, hookController.hook)
}
