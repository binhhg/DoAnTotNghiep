const {google} = require('googleapis')
const {OAuth2Client} = require('google-auth-library')
const {web} = require("../config/credentials.json");
module.exports = (container) => {
    function generateAuthUrl() {
        try {
            const oauth2Client = new google.auth.OAuth2(web.client_id, web.client_secret, process.env.REDIRECT_URI || 'http://localhost:3000/signIn')
            const url = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: [
                    'email',
                    'profile',
                    'https://www.googleapis.com/auth/calendar'
                ],
                prompt: 'consent'
            })
            return {url, ok: true}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }

    }

    async function getToken(code) {
        try {
            const oauth2Client = new google.auth.OAuth2(web.client_id, web.client_secret, process.env.REDIRECT_URI || 'http://localhost:3000/signIn')
            const {tokens} = await oauth2Client.getToken(code)
            return {tokens, ok: true}
        } catch (e) {
            console.log(e)
            return {ok: false}
        }

    }

    async function getUserInfo(token) {
        try {
            const oauth2Client = new OAuth2Client({
                clientId: web.client_id,
                clientSecret: web.client_secret
            })
            const {payload} = await oauth2Client.verifyIdToken({idToken: token})
            return {
                data: {
                    id: payload.sub,
                    name: payload.name,
                    photo: payload.picture,
                    email: payload.email,
                    locale: payload.locale
                },
                ok: true
            }
        } catch (e) {
            console.log(e)
            return {ok: false}
        }
    }

    return {
        generateAuthUrl,
        getToken,
        getUserInfo
    }
}
