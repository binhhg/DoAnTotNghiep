module.exports = (container) => {
    const logger = container.resolve('logger')
    const ObjectId = container.resolve('ObjectId')
    const {
        schemaValidator,
        schemas: {
            User
        }
    } = container.resolve('models')
    const {httpCode, serverHelper} = container.resolve('config')
    const firebaseAdmin = container.resolve('firebaseAdmin')
    const qq = firebaseAdmin.auth()
    const {accountRepo, userRepo} = container.resolve('repo')
    const MAX_DEVICE = +process.env.MAX_DEVICE || 3
    const {googleHelper} = container.resolve('helper')
    const processLoginGoogle = async (code) => {
        const {tokens} = await googleHelper.getToken(code)
        if (tokens) {
            const {data} = await googleHelper.getUserInfo(tokens.access_token)
            if (data) {
                let account = await accountRepo.getAccountFindOne({id: data.id}).lean()
                let user
                if (!account) {
                    const u = {
                        name: data.name,
                        avatar: data.photo || '',
                    }
                    user = await userRepo.addUser(u)
                    const a = {
                        id: data.id,
                        provider: 1,
                        userId: user._id,
                        photo: data.photo || '',
                        refreshToken: tokens.refresh_token,
                        email: data.email
                    }
                    account = await accountRepo.addAccount(a)
                } else {
                    user = account.userId
                }
                const token = serverHelper.genToken({
                    name: user.name,
                    email: account.email,
                    avatar: user.avatar,
                    loginType: 1,
                    id: account.id,
                })
                const hash = serverHelper.generateHash(token)
                const sessions = await sessionRepo.getSessionNoPaging({ id: account.id }, { _id: 1 })
                if (sessions.length >= MAX_DEVICE - 1) {
                    const arr = []
                    while (sessions.length > MAX_DEVICE - 1) {
                        arr.push(sessions.shift())
                    }
                    console.log('.....................................kickSession webview ko bi loi')
                    if (arr.length) {
                        await kickSessions(uid, arr)
                        console.log('logout ', name, uid, arr.length)
                    }
                }
                const sess = {}
                const { exp } = serverHelper.decodeToken(token)
                sess.hash = hash
                sess.expireAt = exp
                await sessionRepo.createSession(sess)
            }
        }
    }
    const generateUrl = async (req, res) => {
        try {
            const data = await googleHelper.generateAuthUrl()
            if (data.ok) {
                res.status(httpCode.SUCCESS).json({url: data.url})
            }
            res.status(httpCode.BAD_REQUEST).json()
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).json()
        }
    }
    const loginOrRegister = async (req, res) => {
        try {
            const {code, type} = req.body
            if (type === 'GOOGLE') {
                const qq = await processLoginGoogle(code)
            }
            res.status(httpCode.CREATED).json({ok: true})
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).json()
        }
    }
    const firebaseCallback = async (req, res) => {
        try {
            const cc = req.query
            const dd = req.body
            console.log(cc, dd)
            res.status(httpCode.SUCCESS).json({ok: true})
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).end()
        }
    }

    return {
        loginOrRegister,
        firebaseCallback,
        generateUrl
    }
}
