module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { userController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.post(`${basePath}/user/loginOrRegister`, userController.loginOrRegister)
  app.get(`${basePath}/callback`, userController.firebaseCallback)
}
