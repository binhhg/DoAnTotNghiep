const {eventConfig} = require('../config')
const stateConfig = {
    new: 1,
    sent: 2,
    legitimacy: 3,
    confirmed: 4,
    technicality: 5,
    purchasing: 6,
    purchased: 7,
    renovating: 8,
    renovated: 9,
    sellable: 10,
    selling: 11,
    sold: 12,
    rejected: 13,
    cancel: 14
}
module.exports = async (container) => {
    const {httpCode, serverHelper, receiverMailConfig} = container.resolve('config')
    const {watchRepo} = container.resolve('repo')
    const {googleHelper, userHelper} = container.resolve('helper')
    const {cronJob} = serverHelper

    async function cron() {
        console.log('vo day ne')
        const a = Math.floor(Date.now() / 1000)
        const list = await watchRepo.getWatchNoPaging().lean()
        console.log(list)
        for (const value of list) {
            console.log('zo')
            const time = value.expiration / 1000
            if ((time - a) < 129600) { // 1,5 ngay
                const {statusCode, data: acc} = await userHelper.getAccountById()
                if (statusCode !== httpCode.SUCCESS) {
                    console.log('bi xoa r')
                    return false
                }
                await googleHelper.deleteWatchCalendar(acc.refreshToken, value.id, value.resourceId)
                const newWatch = await googleHelper.watchCalendar(value.token, acc.refreshToken)
                await watchRepo.updateWatch(value._id, newWatch)
            }
        }
        return true
    }

    const job = new cronJob(
        '00 00 00 * * *',
        async () => {
            await cron()
        },
        null,
        true,
        'Asia/Bangkok'
    )
    job.start()
}
