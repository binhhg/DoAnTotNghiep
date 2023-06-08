module.exports = (app, container) => {
  const { verifyToken } = container.resolve('middleware')
  require('./hookApi')(app, container)
  app.use(verifyToken)
  require('./eventApi')(app, container)
}
