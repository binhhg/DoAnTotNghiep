module.exports = (container) => {
  const eventController = require('./eventController')(container)
  const bookingController = require('./bookingController')(container)
  const hookController = require('./hookController')(container)
  return {
    eventController, bookingController, hookController
  }
}
