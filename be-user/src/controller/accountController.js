module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Account
    }
  } = container.resolve('models')
  const { httpCode, serverHelper } = container.resolve('config')
  const { accountRepo } = container.resolve('repo')
  const addAccount = async (req, res) => {
    try {
      const body = req.body
      const {
        error,
        value
      } = await schemaValidator(body, 'Account')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
      }
      const account = await accountRepo.addAccount(value)
      res.status(httpCode.CREATED).json(account)
    } catch (e) {
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Vị trí này đã tồn tại.' })
      }
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const deleteAccount = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        await accountRepo.deleteAccount(id)
        //TODO: check xem cos quang cao nao laoi nay k roi hay xoa
        res.status(httpCode.SUCCESS).send({ ok: true })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateAccount = async (req, res) => {
    try {
      const { id } = req.params
      const account = req.body
      const {
        error,
        value
      } = await schemaValidator(account, 'Account')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      if (id && account) {
        const item = await accountRepo.updateAccount(id, value)
        res.status(httpCode.SUCCESS).json(item)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getAccountById = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const account = await accountRepo.getAccountById(id)
        res.status(httpCode.SUCCESS).send(account)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const getAccount = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
        ids
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { _id: 1 } : +sort || { _id: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      if (ids) {
        if (ids.constructor === Array) {
          search.id = { $in: ids }
        } else if (ids.constructor === String) {
          search.id = { $in: ids.split(',') }
        }
      }
      delete search.ids
      delete search.page
      delete search.perPage
      delete search.sort
      const pipe = {}
      Object.keys(search).forEach(i => {
        const vl = search[i]
        const pathAccount = (Account.schema.path(i) || {}).instance || ''
        if (pathAccount.toLowerCase() === 'objectid') {
          pipe[i] = ObjectId(vl)
        } else if (pathAccount === 'Number') {
          pipe[i] = +vl
        } else if (pathAccount === 'String' && vl.constructor === String) {
          pipe[i] = new RegExp(vl, 'gi')
        } else {
          pipe[i] = vl
        }
      })
      const data = await accountRepo.getAccount(pipe, perPage, skip, sort)
      const total = await accountRepo.getCount(pipe)
      res.status(httpCode.SUCCESS).send({
        perPage,
        skip,
        sort,
        data,
        total,
        page
      })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  return {
    addAccount,
    getAccount,
    getAccountById,
    updateAccount,
    deleteAccount
  }
}
