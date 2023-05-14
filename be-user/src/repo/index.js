const repo = (container) => {
  const userRepo = require('./userRepo')(container)
  const accountRepo = require('./accountRepo')(container)
  const sessionRepo = require('./sessionRepo')(container)
  return { accountRepo, userRepo, sessionRepo }
}
const connect = (container) => {
  const dbPool = container.resolve('db')
  if (!dbPool) throw new Error('Connect DB failed')
  return repo(container)
}

module.exports = { connect }
