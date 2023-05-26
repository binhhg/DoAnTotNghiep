module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { userController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.post(`${basePath}/login`, userController.login)
  app.post(`${basePath}/user/loginOrRegister`, userController.loginOrRegister)
  app.get(`${basePath}/user/genUrl`, userController.generateUrl)
}
