const { google } = require('googleapis')
const { v4 : uuidv4 } = require('uuid');
const { web } = require('./credentials.json')
const admin = require('firebase-admin')
const moment = require('moment')
const serviceAccount = require('./dulcet-coast-383615-firebase-adminsdk-xo3cc-678bd16117.json')

const oauth2Client = new google.auth.OAuth2(web.client_id, web.client_secret, 'http://localhost:3000/api/auth/callback/google')
// const url = oauth2Client.generateAuthUrl({
//   access_type: 'offline',
//   scope: [
//     'email',
//     'profile',
//     'https://www.googleapis.com/auth/calendar'
//   ],
//   prompt: 'consent'
// })
// console.log(url)
//
// async function getToken (token) {
//   try {
//     const data = await oauth2Client.getToken(token)
//     console.log('zzz', data)
//     return data
//   } catch (e) {
//     console.log(e)
//   }
//
// }

// getToken('4/0AbUR2VOP_9ZitdeyU0wqDuCwe4q3YE13u0Irx18XpvnRFd2jyBYCyrjNeD_7IXDwrNZE1g').then()
oauth2Client.setCredentials({ refresh_token: '1//0grT68rnR0s1NCgYIARAAGBASNwF-L9IrWN1IKIor5yT9yUanq-Y3nhrV4LAZwzTAxgBMdMKHN88rnkHkcQ_SPmRCyd20Ugc7hRI' })

async function listCalendars () {
  // Tạo client cho Google Calendar API
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  try {
    // Lấy danh sách calendar
    const response = await calendar.events.list({
      calendarId: 'primary', // Để lấy lịch của người dùng chính (primary calendar)
      // timeMin: new Date().toISOString(), // Lấy sự kiện từ ngày hiện tạilượng sự kiện tối đa
      singleEvents: false,
      // showDeleted: false,
      syncToken: "CMi899zVtoADEMi899zVtoADGAUg7u7RhgI="
      // orderBy: 'starttime'
    })
    const calendars = response.data.items
    console.log(response.data)
    console.log(JSON.stringify(calendars[calendars.length-1]))
    // In ra danh sách calendar\
    calendars.sort((a,b) => {
      if(a.id < b.id) return -1
      return 1
    })
    console.log(calendars.length, 'leng ne')
    calendars.forEach((calendar) => {
      console.log(`${calendar.summary} (${calendar.id})`)
    })
  } catch (error) {
    console.error('Lỗi khi lấy danh sách calendar:', error)
  }
}

async function watchCalendar () {
  // Tạo client cho Google Calendar API
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  try {
    // Lấy danh sách calendar
    const response = await calendar.events.watch({
      calendarId: 'primary',
      resource: {
        id: uuidv4(),
        token: '64bdf8fecd11322ac363e9f8',
        type: 'web_hook',
        address: process.env.WEB_HOOK_URL || 'https://api.icalendar.click/calendar/hook',
        params: {
          ttl: '600'
        }
      }
    })
    const aa = response.data
    console.log(aa)
  } catch (error) {
    console.error('Lỗi khi lấy danh sách calendar:', error)
  }
}
async function deleteWatchCalendar () {
  // Tạo client cho Google Calendar API
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  try {
    // Lấy danh sách calendar
    const response = await calendar.channels.stop({
      resource: {
        id: "cf8bbf2e-f6bd-48c5-b2b7-868d4a3f94c7",
        resourceId: "QqnBWo74dEh8hBYJaul5gdT6maw"
      }
    })
    const aa = response.data
    console.log(aa)
    console.log(response)
  } catch (error) {
    console.error('Lỗi khi lấy danh sách calendar:', error)
  }
}

async function addCalendar () {
  const event = {
    summary: 'Ttest cai de ne 3',
    description: 'Mô tả sự kiện',
    start: {
      dateTime: '2023-06-28T06:30:00+07:00',
      timeZone: 'Asia/Ho_Chi_Minh'
    },
    end: {
      dateTime: '2023-06-28T08:30:00+07:00',
      timeZone: 'Asia/Ho_Chi_Minh'
    },
    // recurrence: ['RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR'],
    // conferenceData: {
    //   createRequest: {
    //     requestId: '7qxalsvy0e',
    //     conferenceSolutionKey: {
    //       type: 'hangoutsMeet'
    //     }
    //   }
    // },
    location: 'p604 thu vien ne',
    reminders: {
      useDefault: true
    },
    attendees: [
      { email: 'binhpt@carpla.vn' }
    ]
  }
  const calendar = google.calendar({ version: 'v3' })
  calendar.events.insert({
    auth: oauth2Client,
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1,
    sendUpdates: 'all'
  }, (err, res) => {
    if (err) return console.log(`Lỗi: ${err}`)
    console.log(`Đã tạo sự kiện: ${res.data.htmlLink}`)
    console.log('res ne ', res.data)
  })
}

async function update1EventOfRecurringEvent (id) {
  const event = {
    start: {
      dateTime: '2023-06-07T09:00:00+07:00',
      timeZone: 'Asia/Ho_Chi_Minh'
    },
    end: {
      dateTime: '2023-06-07T11:00:00+07:00',
      timeZone: 'Asia/Ho_Chi_Minh'
    },
    recurringEventId: id,
    originalStartTime: {
      dateTime: '2023-07-06T16:30:00Z',
      timeZone: 'Asia/Ho_Chi_Minh'
    }
  }
  const calendar = google.calendar({ version: 'v3' })
  calendar.events.insert({
    auth: oauth2Client,
    calendarId: 'primary',
    resource: event
  }, (err, res) => {
    if (err) return console.log(`Lỗi: ${err}`)
    console.log(`Đã tạo sự kiện: ${res.data.htmlLink}`)
    console.log('res ne ', res.data)
  })
}

async function addNewRecurringFromCurrentRecurring (id) {
  const event = {
    id: '(p802ndklpimeq8plhc1f1mju2c_R20230607T020000',
    etag: '"3371747834136000"',
    summary: 'Ttest cai de ne',
    location: 'Địa điểm',
    description: 'Mô tả sự kiện',
    start: {
      dateTime: '2023-06-07T09:00:00+07:00',
      timeZone: 'Asia/Ho_Chi_Minh'
    },
    end: {
      dateTime: '2023-06-07T14:00:00+07:00',
      timeZone: 'Asia/Ho_Chi_Minh'
    },
    recurrence: ['RRULE:FREQ=DAILY']
  }
  const calendar = google.calendar({ version: 'v3' })
  const { data } = await calendar.events.get({
    auth: oauth2Client,
    calendarId: 'primary',
    eventId: id
  })
  await calendar.events.update({
    auth: oauth2Client,
    calendarId: 'primary',
    eventId: id,
    resource: { ...data, recurrence: ['RRULE:FREQ=DAILY;UNTIL=20230606T165959Z'] }

  })
  delete data.id
  await calendar.events.insert({
    auth: oauth2Client,
    calendarId: 'primary',
    resource: event
  })
}

async function deleteCalendar (id) {
  const calendar = google.calendar({ version: 'v3' })
  calendar.events.delete({
    auth: oauth2Client,
    calendarId: 'primary',
    eventId: id
  }, (err, res) => {
    if (err) return console.log(`Lỗi: ${err}`)
    console.log(`Đã tạo sự kiện: ${res.data.htmlLink}`)
    console.log('res ne ', res.data)
  })
}

async function deleteCalendar2 (id) {
  const calendar = google.calendar({ version: 'v3' })
  calendar.events.delete({
    auth: oauth2Client,
    calendarId: 'primary',
    eventId: id,
    originalStartTime: {
      dateTime: '2023-06-22T20:30:00+07:00',
      timeZone: 'Asia/Ho_Chi_Minh'
    }
  }, (err, res) => {
    if (err) return console.log(`Lỗi: ${err}`)
    console.log(`Đã tạo sự kiện: ${res.data.htmlLink}`)
    console.log('res ne ', res.data)
  })
}

async function getInstences (id) {
  // Tạo client cho Google Calendar API
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  try {
    // Lấy danh sách calendar
    const response = await calendar.events.instances({
      calendarId: 'primary', // Để lấy lịch của người dùng chính (primary calendar)
      // orderBy: 'created'
      eventId: id,
      // timeMin: '2023-06-07'
      // originalStart: '2023-06-22T09:00:00+07:00'
    })
    const calendars = response.data.items
    console.log(response.data.items)
    // In ra danh sách calendar
    console.log(calendars.length, 'leng ne')
    calendars.forEach((calendar) => {
      console.log(`${calendar.summary} (${calendar.id})`)
    })
  } catch (error) {
    console.error('Lỗi khi lấy danh sách calendar:', error)
  }
}

async function getAndUpdate (id) {
  try {
    const calendar = google.calendar({ version: 'v3' })
    const { data } = await calendar.events.get({
      auth: oauth2Client,
      calendarId: 'primary',
      eventId: id
    })
    data.recurrence  =  [ 'RRULE:FREQ=DAILY;UNTIL=20230706T170000Z' ]
    await calendar.events.patch({
      auth: oauth2Client,
      calendarId: 'primary',
      eventId: id,
      resource: data
    })
  } catch (e) {
    console.log(e)
  }
}

// deleteCalendar('0pl8un75t77hrophqk6ng9u7a9_20230622T020000Z').then()
// update1EventOfRecurringEvent('cq8452or5br9flmdvubg2ak1gs').then()
// addNewRecurringFromCurrentRecurring('oln8rmgncjq4leouusbsftvt88').then()
// getAndUpdate('67pvaoi966gfm8edrennp3sr1t').then()
// listCalendars().then()
watchCalendar().then()
// deleteWatchCalendar().then()
// deleteCalendar('hcdsrlkkcvem3srbcvsjug67d0').then()
// addCalendar().then()
// getInstences('2ntgfcc0q9a8q5c9o62su8r1hl').then()
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// })
// const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFiYjI2MzY4YTNkMWExNDg1YmNhNTJiNGY4M2JkYjQ5YjY0ZWM2MmYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQmluaCBQaGFtIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FHTm15eFl5NGhUNFRRdlZBOENuMWdmMmRheXBEUGtRMksxbUlxZ3h5SmtKPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2R1bGNldC1jb2FzdC0zODM2MTUiLCJhdWQiOiJkdWxjZXQtY29hc3QtMzgzNjE1IiwiYXV0aF90aW1lIjoxNjg0MjE5MTg4LCJ1c2VyX2lkIjoiNnRXTWo0Q2Q0Q2VzSXhXZFpDNXlHYUJrZXVvMiIsInN1YiI6IjZ0V01qNENkNENlc0l4V2RaQzV5R2FCa2V1bzIiLCJpYXQiOjE2ODQyMTkxODgsImV4cCI6MTY4NDIyMjc4OCwiZW1haWwiOiJiaW5odnhoZzc4OUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExNDMzMjI0MjI4OTgwNjA4NTI1NyJdLCJlbWFpbCI6WyJiaW5odnhoZzc4OUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.e8_H14u7wfEqgDRl_YAxjVbS28lB_aRjRHg656_L-lG7B9qhIs4gH1zd3RRjk2ZOz_YDhRT8GIKf5N2UMMShTNM_-ru1J2dbtjbSDBqFjFxlziFY7mpjlXheljEL0u8rxlIIOlfi_BiQ_TJ_BaAcArMqxbfjhY4XNYhJ-SWgMufBGFO6A7rTvE0f55ZcqT0B1QLp0zE9-FHuwQr9zbuZdPyXtc0KAQh2BCc0pfkzHQ9X7lH1t5755gBqNFfjCn_S_wSiR1Jjsea_hgOKA3r3SUq35O8cSSZJFX9QglHWkhw1LNP9nxMqZatKmHpyV31QcJD51TyGEV7Wa3bbLJweNQ'
// let cc
//
// async function verifyIdToken (token) {
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token)
//     console.log(decodedToken)
//     const uid = decodedToken.uid
//     const user = await admin.auth().getUser(uid)
//     const qq = await admin.auth().createCustomToken(uid)
//     console.log('qq', qq)
//     return decodedToken
//   } catch (error) {
//     console.error('Error verifying ID token:', error)
//     throw error
//   }
// }
//
// verifyIdToken(token).then()
// User ID of the user to get the refresh token
