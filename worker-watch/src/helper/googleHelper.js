const { web } = require('../config/credentials.json')
const { google } = require('googleapis')
const { v4 : uuidv4 } = require('uuid')
module.exports = (container) => {
  const watchCalendar = async (id, token) => {
    try {
      let data, error
      const oauth2Google = new google.auth.OAuth2(web.client_id, web.client_secret)
      oauth2Google.setCredentials({ refresh_token: token })
      const calendar = google.calendar({ version: 'v3', auth: oauth2Google })
      const response = await calendar.events.watch({
        calendarId: 'primary',
        resource: {
          id: uuidv4(),
          token: id,
          type: 'web_hook',
          address: process.env.WEB_HOOK_URL || 'https://api.icalendar.click/calendar/hook',
          params: {
            // ttl: '604800'
            ttl: '600'
          }
        }
      })
      data = response.data
      return { data }
    } catch (e) {
      console.log(e)
      return { error: e }
    }
  }
  const deleteWatchCalendar = async (token,id,resId) => {
    try {
      let data, error
      const oauth2Google = new google.auth.OAuth2(web.client_id, web.client_secret)
      oauth2Google.setCredentials({ refresh_token: token })
      const calendar = google.calendar({ version: 'v3', auth: oauth2Google })
      const response = await calendar.channels.stop({
        resource: {
          id: id,
          resourceId: resId
        }
      })
      data = response.data
      return { data }
    } catch (e) {
      console.log(e)
      return { error: e }
    }
  }
  return {
    watchCalendar,
    deleteWatchCalendar
  }
}
