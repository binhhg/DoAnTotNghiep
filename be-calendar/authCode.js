const admin = require('firebase-admin')
const axios = require('axios')
const serviceAccount = require('./dulcet-coast-383615-firebase-adminsdk-xo3cc-678bd16117.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
const uid = 'jmOCwi2RA7gWp14rhLXrhzqs3Vt1'
admin.auth().createCustomToken(uid)
  .then((customToken) => {
    const postData = {
      client_id: '217109832798-u2oasqosr3fa40n9nkmfvluq65vrkjbd.apps.googleusercontent.com',
      client_secret: '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',
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: customToken,
      redirect_uri: 'http://localhost:8003/callback',
      scopes: [
        'openId',
        'email',
        'profile',
        'https://www.googleapis.com/auth/calendar'
      ]
    }
    const url = 'https://oauth2.googleapis.com/token'
    axios.post(url, postData)
      .then((response) => {
        const refreshToken = response.data.refresh_token
        console.log('ress', response)
      })
      .catch((error) => {
        console.log(error)
      })
  })
  .catch((error) => {
    console.log(error)
  })
