module.exports = (app, container) => {
  const { verifyAccessTokenB2 } = container.resolve('middleware')
  require('./userApi')(app, container)
  require('./internalApi')(app, container)
}
