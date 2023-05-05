module.exports = container => {
  const mediator = container.resolve('mediator')
  const { publisher } = container.resolve('queue')
  const { eventConfig, workerConfig, actionConfig } = container.resolve('config')
  mediator.on(eventConfig.GOOGLE_CALENDAR, async ({ action, data }) => {
    console.log('dddd ', data)
    switch (action) {
      case actionConfig.CREATE: {
        await publisher.sendToQueue({
          payload: data,
          action
        }, workerConfig.queueName)
        console.log('push create')
        break
      }
    }
  }
  )
}
