module.exports = (container) => {
  const eventController = require('./eventController')(container)
  const bookingController = require('./bookingController')(container)
  const hookController = require('./hookController')(container)
  const internalController = require('./internalController')(container)
  return {
    eventController, bookingController, hookController,internalController
  }
}
