const http = require('http')
module.exports.start = function (container) {
    const {subscriber} = container.resolve('queue')
    const logger = container.resolve('logger')
    const {
        httpCode,
        serverHelper
    } = container.resolve('config')
    const {watchRepo} = container.resolve('repo')
    const {googleHelper} = container.resolve('helper')
    const mediator = container.resolve('mediator')
    const jobs = []
    const EVENT_NAME = 'nextjob'
    const actionConfig = {
        ADD_GOOGLE: 'add-google',
        DEL_GOOGLE: 'del-google'
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

    async function sync({action,id,token}) {
        switch (action) {
            case actionConfig.ADD_GOOGLE: {
                const {data} = await googleHelper.watchCalendar(id,token)
                await watchRepo.addWatch(data)
                console.log('add watch')
                return true
            }
            case actionConfig.DEL_GOOGLE: {
                console.log('vao day')
                const watch = await watchRepo.getWatchFindOne({token: id}).lean()
                if(!watch){
                    console.log('sao k co watch')
                } else {
                    await googleHelper.deleteWatchCalendar(token,watch.id,watch.resourceId)
                    await watchRepo.deleteWatch(watch._id)
                }
                return true
            }
        }
        return false
    }

    async function handle(msg) {
        try {
            logger.d('handle, remaining:', jobs.length)
            const message = msg.content.toString('utf8')
            const obj = JSON.parse(message)
            logger.d(message)
            const {
                action,
                id,
                token
            } = obj
            if (!id || !token || !action) {
                console.log('action k co', action)
                mediator.emit(EVENT_NAME, '')
                return subscriber.ack(msg)
            }
            const result = await sync({action,id,token})
            if (!result) {
                logger.d('???', message)
                // subscriber.ack(msg)
            } else {
                subscriber.ack(msg)
            }

            mediator.emit(EVENT_NAME, '')
        } catch (e) {
            logger.e(e)
            jobs.push(msg)
            logger.d('err, retry ,jobslength', jobs.length)
            mediator.emit(EVENT_NAME, '')
        }
    }
}
