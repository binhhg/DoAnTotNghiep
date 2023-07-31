module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { userController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')
  app.post(`${basePath}/login`, userController.login)
  app.post(`${basePath}/logout`, userController.logout)
  app.get(`${basePath}/user`, verifyToken, userController.getUser)
  app.put(`${basePath}/user`, verifyToken, userController.updateInfo)
  app.post(`${basePath}/user/loginOrRegister`, userController.loginOrRegister)
  app.get(`${basePath}/user/genUrl`, userController.generateUrl)
}
