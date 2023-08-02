const repo = (container) => {
  const watchRepo = require('./watchRepo')(container)
  return { watchRepo}
}
const connect = (container) => {
  const dbPool = container.resolve('db')
  if (!dbPool) throw new Error('Connect DB failed')
  return repo(container)
}

module.exports = { connect }
