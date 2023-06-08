module.exports = (app, container) => {
  require('./userApi')(app, container)
  require('./internalApi')(app, container)
  require('./hookApi')(app, container)
  require('./accountApi')(app, container)
  require('./configApi')(app, container)
}
