const repo = (container) => {
  const bookingRepo = require('./bookingRepo')(container)
  const eventRepo = require('./eventRepo')(container)
  return { eventRepo, bookingRepo }
}
const connect = (container) => {
  const dbPool = container.resolve('db')
  if (!dbPool) throw new Error('Connect DB failed')
  return repo(container)
}

module.exports = { connect }
