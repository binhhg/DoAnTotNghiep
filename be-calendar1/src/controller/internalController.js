const {httpCode} = require("../config");
module.exports = container => {
    const logger = container.resolve('logger')
    const ObjectId = container.resolve('ObjectId')
    const {eventRepo, bookingRepo, syncResourceRepo} = container.resolve('repo')
    const removeAll = async (req, res) => {
        try {
            const body = req.body
            await syncResourceRepo.removeSyncResource({accountId: new ObjectId(body.id)})
            const data = await bookingRepo.findMany({
                accountId: new ObjectId(body.id)
            }).lean()
            const events = [], bookings = []
            for (const va of data) {
                events.push(va.eventId._id)
                bookings.push(va._id)
            }
            await eventRepo.removeEvent({_id: {$in: events}})
            await bookingRepo.removeBooking({_id: {$in: bookings}})
            return res.status(200).json({ok: true})
        } catch (e) {
            console.log(e)
            res.status(400).json({ok: false})
        }
    }
    return {
        removeAll
    }
}
