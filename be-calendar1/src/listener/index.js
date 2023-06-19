const { workerElasticConfig } = require('../config')
module.exports = container => {
  const mediator = container.resolve('mediator')
  const { userRepo } = container.resolve('repo')


  mediator.on('eventChange', async ({}) => {

  })
}
