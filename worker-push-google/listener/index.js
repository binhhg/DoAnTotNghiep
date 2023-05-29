const http = require('http')
module.exports.start = function (container) {
  const { subscriber } = container.resolve('queue')
  const logger = container.resolve('logger')
  const {
    httpCode,
    serverHelper
  } = container.resolve('config')
  const mediator = container.resolve('mediator')
  const esHelper = container.resolve('esHelper')
  const { xenforoHelper } = container.resolve('helper')
  const jobs = []
  const EVENT_NAME = 'nextjob'
  const actionConfig = {
    INIT: 'init',
    CREATE: 'create',
    UPDATE: 'updated',
    DELETE: 'deleted',
  }
  const typeConfig = {
    THREAD: 1,
    USER: 2
  }
  subscriber.on('message', async msg => {
    logger.d('newMessage', new Date())
    jobs.push(msg)
    mediator.emit(EVENT_NAME, '')
  })
  mediator.on(EVENT_NAME, async () => {
    if (jobs.length) {
      const msg = jobs.shift()
      await handle(msg)
    }
  })

  const formatPull = async (action, type, payload) => {
    console.log('ua alo cai action', action)
    if (action === actionConfig.CREATE || action === actionConfig.UPDATE) {
        return 5
    } else {
      return payload
    }
  }
  const formatPush = async (action, type, payload) => {
    console.log('ua alo cai action', action)
    if (action === actionConfig.CREATE || action === actionConfig.UPDATE) {
        return 5
    } else {
      return payload
    }
  }


  async function sync (action, data) {
    switch (action) {
      case actionConfig.INIT: {

        return true
      }
      case actionConfig.CREATE: {
          break
      }
      case actionConfig.UPDATE: {
        break
      }
      case actionConfig.DELETE: {
        return true
      }
    }
    return false
  }

  async function handle (msg) {
    try {
      logger.d('handle, remaining:', jobs.length)
      const message = msg.content.toString('utf8')
      const obj = JSON.parse(message)
      logger.d(message)
      const {
        action,
        payload,
        type
      } = obj
      if (!payload || !action) {
        console.log('action k co', action)
        mediator.emit(EVENT_NAME, '')
        return subscriber.ack(msg)
      }
      const format = await formatData(action, type, payload)
      if (!format) {
        subscriber.ack(msg)
      } else {
        const result = await sync(action, type, format)
        if (!result) {
          logger.d('???', message)
          // subscriber.ack(msg)
        } else {
          subscriber.ack(msg)
        }
      }
      mediator.emit(EVENT_NAME, '')
    } catch (e) {
      logger.e(e)
      jobs.push(msg)
      logger.d('err, retry ,jobslength', jobs.length)
      mediator.emit(EVENT_NAME, '')
    }
  }

  return {
    formatData
  }
}
