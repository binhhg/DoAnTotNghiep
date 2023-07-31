module.exports = (app, container) => {
  const { hookController } = container.resolve('controller')
  app.post('/hook', hookController.hook)
}
