module.exports = (app, container) => {
  const { verifyToken } = container.resolve('middleware')
  require('./hookApi')(app, container)
  require('./internalApi')(app, container)
  app.use(verifyToken)
  require('./eventApi')(app, container)
}
