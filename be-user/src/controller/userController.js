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
    const {accountRepo, userRepo, sessionRepo} = container.resolve('repo')
    const {googleHelper} = container.resolve('helper')
    const processLoginGoogle = async (code) => {
        const {tokens} = await googleHelper.getToken(code)
        if (tokens) {
            const {data} = await googleHelper.getUserInfo(tokens.id_token)
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
                    if(tokens.refresh_token){  // nghĩa là nó đã xóa quyền truy cập hoặc refresh token hết hạn nên khi login nó sẽ cấp lại cái refresh này
                        await accountRepo.updateAccount(account._id,{
                            refreshToken: tokens.refresh_token
                        })
                    }
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
                const sess = {}
                const {exp} = serverHelper.decodeToken(token)
                sess.hash = hash
                sess.expireAt = exp
                await sessionRepo.createSession(sess)
                return {token, user, ok: true}
            }
            return {ok: false, msg: '58'}
        }
        return {ok :false, msg: '60'}
    }
    const generateUrl = async (req, res) => {
        try {
            const data = await googleHelper.generateAuthUrl()
            if (data.ok) {
                return res.status(httpCode.SUCCESS).json({url: data.url})
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
                const user = await processLoginGoogle(code)
                if(user.ok){
                   return res.status(httpCode.SUCCESS).json(user)
                }
                return res.status(httpCode.BAD_REQUEST).json({msg: 'loi trong qua trinh dang nhap'})
            }
            return res.status(httpCode.BAD_REQUEST).json({msg: 'phuong thuc dang nhap khong dung'})
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).json()
        }
    }
    const refreshToken = async (req, res) => {
        try {
            const token = req.headers['x-access-token']
            if(token){

            }

            res.status(httpCode.UNAUTHORIZED).json({ ok: false })
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
        generateUrl,
        refreshToken
    }
}
