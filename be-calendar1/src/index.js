const { initDI } = require('./di')
const { name } = require('../package.json')
const config = require('./config')
const logger = require('./logger')
const firebaseAdmin = require('firebase-admin')
const middleware = require('./middleware')
const server = require('./server')
const listener = require('./listener')
const models = require('./models')
const controller = require('./controller')
const { connect } = require('./database')
const { Publisher, createChannel } = require('./queue')
const repo = require('./repo')
const EventEmitter = require('events').EventEmitter
const mediator = new EventEmitter()
logger.d(`${name} Service`)
mediator.once('di.ready', container => {
  console.log('di.ready, starting connect db ')
  container.registerValue('config', config)
  container.registerValue('middleware', middleware)
  container.registerValue('logger', logger)
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(config.firebaseConfig.serviceAccountPath),
    // databaseURL: config.firebaseConfig.databaseURL
  })
  console.log('connected firebase ', config.firebaseConfig)
  container.registerValue('firebaseAdmin', firebaseAdmin)
  container.registerValue('mediator', mediator)
  mediator.once('db.ready', async db => {
    logger.d('db.ready, starting server')
    container.registerValue('db', db)
    container.registerValue('models', models(container))
    const repository = repo.connect(container)
    container.registerValue('repo', repository)
    container.registerValue('controller', controller(container))
    container.registerValue('middleware', middleware(container))
    const channel = await createChannel(config.rabbitConfig)
    logger.d(config.workerConfig)
    container.registerValue('queue', {
      publisher: new Publisher(channel, config.workerConfig.exchange, config.workerConfig.exchangeType)
    })
    server.start(container).then(app => {
      logger.d('Server started at port ', app.address().port)
      listener(container)
    })
  })
  connect(container, mediator)
})
initDI(mediator)
