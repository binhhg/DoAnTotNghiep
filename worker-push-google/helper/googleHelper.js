const { web } = require('../config/credentials.json')
const { google } = require('googleapis')
module.exports = (container) => {
  const oauth2Google = new google.auth.OAuth2(web.client_id, web.client_secret, 'http://localhost:3001/signin')
  const insertEvent = (token, event) => {
    let data, error
    oauth2Google.setCredentials({ refresh_token: token })
    const calendar = google.calendar({ version: 'v3' })
    calendar.events.insert({
      auth: oauth2Google,
      calendarId: 'primary',
      resource: event
    }, (err, res) => {
      if (err) error = err
      data = res.data
    }).then()
    return { data, error }
  }
  return {
    insertEvent
  }
}
