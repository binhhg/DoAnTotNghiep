const http = require('http')
module.exports = function (container) {
    const {publisher} = container.resolve('queue')
    const logger = container.resolve('logger')
    const {
        httpCode,
        serverHelper,
        workerConfig
    } = container.resolve('config')
    const actionConfig = {
        ADD_GOOGLE: 'add-google',
        DEL_GOOGLE: 'del-google'
    }
    const mediator = container.resolve('mediator')
    mediator.on('watch', async ({id, token, action}) => {
        await publisher.sendToQueue({
            id,token,action
        }, workerConfig.queueName)
        console.log('success push', id, action)
    })
}
