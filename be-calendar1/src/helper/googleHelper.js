const { google } = require('googleapis')
const { OAuth2Client } = require('google-auth-library')
const { web } = require('../config/credentials.json')
module.exports = (container) => {
  async function addCalendar (token, dataSend) {
    try {
      const oauth2Client = new google.auth.OAuth2(web.client_id, web.client_secret, process.env.REDIRECT_URI || 'http://localhost:3000/signIn')
      oauth2Client.setCredentials({ refresh_token: token })
      const calendar = google.calendar({ version: 'v3' })
      const { data } = await calendar.events.insert({
        auth: oauth2Client,
        calendarId: 'primary',
        resource: dataSend
      })
      return { ok: true, data }
    } catch (e) {
      console.log(e)
      return { ok: false, msg: e }
    }
  }

  return {
    addCalendar
  }
}
