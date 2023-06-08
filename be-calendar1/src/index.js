const { initDI } = require('./di')
const { name } = require('../package.json')
const config = require('./config')
const logger = require('./logger')
const middleware = require('./middleware')
const server = require('./server')
const models = require('./models')
const helper = require('./helper')
const controller = require('./controller')
const { connect } = require('./database')
const repo = require('./repo')
const EventEmitter = require('events').EventEmitter
const mediator = new EventEmitter()
logger.d(`${name} Service`)
mediator.once('di.ready', container => {
  console.log('di.ready, starting connect db ')
  container.registerValue('config', config)
  container.registerValue('middleware', middleware)
  container.registerValue('logger', logger)
  container.registerValue('mediator', mediator)
  mediator.once('db.ready', async db => {
    logger.d('db.ready, starting server')
    container.registerValue('db', db)
    container.registerValue('models', models(container))
    const repository = repo.connect(container)
    container.registerValue('repo', repository)
    container.registerValue('helper', helper(container))
    container.registerValue('controller', controller(container))
    container.registerValue('middleware', middleware(container))
    server.start(container).then(app => {
      logger.d('Server started at port ', app.address().port)
    })
  })
  connect(container, mediator)
})
initDI(mediator)
