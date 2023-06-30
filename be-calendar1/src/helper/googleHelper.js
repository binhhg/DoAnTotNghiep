const { google } = require('googleapis')
const { OAuth2Client } = require('google-auth-library')
const { web } = require('../config/credentials.json')
module.exports = (container) => {
  async function addCalendar (token, dataSend) {
    try {
      const oauth2Client = new google.auth.OAuth2(web.client_id, web.client_secret, process.env.REDIRECT_URI || 'http://localhost:3000/login')
      oauth2Client.setCredentials({ refresh_token: token })
      const calendar = google.calendar({ version: 'v3' })
      const { data } = await calendar.events.insert({
        auth: oauth2Client,
        calendarId: 'primary',
        resource: dataSend,
        sendUpdates: 'all',
        conferenceDataVersion: 1,
        supportsAttachments: true
      })
      return { ok: true, data }
    } catch (e) {
      console.log(e)
      return { ok: false, msg: e }
    }
  }

  async function updateCalendar (token, id, dataSend) {
    try {
      const oauth2Client = new google.auth.OAuth2(web.client_id, web.client_secret, process.env.REDIRECT_URI || 'http://localhost:3000/signIn')
      oauth2Client.setCredentials({ refresh_token: token })
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
      const { data } = await calendar.events.update({
        calendarId: 'primary',
        eventId: id,
        resource: dataSend,
        sendUpdates: 'all',
        supportsAttachments: true
      })
      return { ok: true, data }
    } catch (e) {
      console.log(e)
      return { ok: false, msg: e }
    }
  }
  async function updateCalendarPatch (token, id, dataSend) {
    try {
      const oauth2Client = new google.auth.OAuth2(web.client_id, web.client_secret, process.env.REDIRECT_URI || 'http://localhost:3000/signIn')
      oauth2Client.setCredentials({ refresh_token: token })
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
      const { data } = await calendar.events.patch({
        calendarId: 'primary',
        eventId: id,
        resource: dataSend,
        sendUpdates: 'all',
        supportsAttachments: true
      })
      return { ok: true, data }
    } catch (e) {
      console.log(e)
      return { ok: false, msg: e }
    }
  }

  async function deleteCalendar (token, id) {
    try {
      const oauth2Client = new google.auth.OAuth2(web.client_id, web.client_secret, process.env.REDIRECT_URI || 'http://localhost:3000/signIn')
      oauth2Client.setCredentials({ refresh_token: token })
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
      const { data } = await calendar.events.delete({
        calendarId: 'primary',
        eventId: id,
        sendUpdates: 'all',
      })
      return { ok: true, data }
    } catch (e) {
      console.log(e)
      return { ok: false, msg: e }
    }
  }

  async function getCalendarById (token, id) {
    try {
      const oauth2Client = new google.auth.OAuth2(web.client_id, web.client_secret, process.env.REDIRECT_URI || 'http://localhost:3000/signIn')
      oauth2Client.setCredentials({ refresh_token: token })
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
      const { data } = await calendar.events.get({
        calendarId: 'primary',
        eventId: id
      })
      return { ok: true, data }
    } catch (e) {
      console.log(e)
      return { ok: false, msg: e }
    }
  }

  return {
    addCalendar,
    updateCalendar,
    deleteCalendar,
    getCalendarById,
    updateCalendarPatch
  }
}
