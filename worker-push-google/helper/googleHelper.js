const { web } = require('../config/credentials.json')
const { google } = require('googleapis')
const { response } = require('express')
module.exports = (container) => {
  const oauth2Google = new google.auth.OAuth2(web.client_id, web.client_secret, 'http://localhost:3001/signin')
  const insertEvent = (token, event) => {
    try {
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
    } catch (e) {
      console.log(e)
      return { error: e }
    }

  }
  const getListEvent = async (token) => {
    try {
      let data, error
      oauth2Google.setCredentials({ refresh_token: token })
      const calendar = google.calendar({ version: 'v3', auth: oauth2Google })
      const response = await calendar.events.list({
        calendarId: 'primary', // Để lấy lịch của người dùng chính (primary calendar)
        timeMin: new Date().toISOString(), // Lấy sự kiện từ ngày hiện tại
        singleEvents: false,
        orderBy: 'startTime'
      })
      data = response.data.items
      return { data, error }
    } catch (e) {
      console.log(e)
      return { error: e }
    }
  }
  const watchCalendar = async (tokenAuth, id, token) => {
    try {
      let data, error
      oauth2Google.setCredentials({ refresh_token: tokenAuth })
      const calendar = google.calendar({ version: 'v3', auth: oauth2Google })
      const response = await calendar.events.watch({
        id,
        token,
        type: 'web_hook',
        address: process.env.WEB_HOOK_URL || 'http://localhost:8305/hook',
        params: {
          ttl: '3600'
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
    insertEvent,
    getListEvent,
    watchCalendar
  }
}
