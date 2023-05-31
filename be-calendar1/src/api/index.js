module.exports = (app, container) => {
  const { verifyAccessTokenB2 } = container.resolve('middleware')
  require('./hookApi')(app, container)
}
