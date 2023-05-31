module.exports = (app, container) => {
  const { hookController } = container.resolve('controller')
  app.get('/hook', hookController.hook)
}
