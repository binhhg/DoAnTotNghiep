module.exports = (container) => {
  const eventController = require('./eventController')(container)
  const bookingController = require('./bookingController')(container)
  return {
    eventController, bookingController
  }
}
