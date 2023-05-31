const { google } = require('googleapis')
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
oauth2Client.setCredentials({ refresh_token: '1//0e-74PN8ULWs7CgYIARAAGA4SNwF-L9Irq0ZQoKrswz3jiauKZAqfciOH-olzmrNKLO4_FMyE2DrK-AidtSRt3ZtSf7bJ7_-nDXg' })

async function listCalendars () {
  // Tạo client cho Google Calendar API
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  try {
    // Lấy danh sách calendar
    const response = await calendar.events.list({
      calendarId: 'primary', // Để lấy lịch của người dùng chính (primary calendar)
      timeMin: new Date().toISOString(), // Lấy sự kiện từ ngày hiện tạilượng sự kiện tối đa
      singleEvents: false
      // orderBy: 'created'
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
async function watchCalendar () {
  // Tạo client cho Google Calendar API
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  try {
    // Lấy danh sách calendar
    const response = await calendar.events.watch({
      calendarId: 'primary',
      resource: {
        id: '123456789',
        token: 'asbhdgasdasdbvdhasvdh',
        type: 'web_hook',
        address: process.env.WEB_HOOK_URL || 'http://localhost:8501/hookTest',
        params: {
          ttl: '3600'
        }
      }
    })
    const aa = response.data
    const qq = 4
  } catch (error) {
    console.error('Lỗi khi lấy danh sách calendar:', error)
  }
}

// Thực thi lấy danh sách calendar
watchCalendar().then()
// const event = {
//   summary: 'Ttest cai de ne',
//   location: 'Địa điểm',
//   description: 'Mô tả sự kiện',
//   start: {
//     dateTime: '2023-04-27T09:00:00-07:00',
//     timeZone: 'Asia/Ho_Chi_Minh'
//   },
//   end: {
//     dateTime: '2023-04-27T17:00:00-07:00',
//     timeZone: 'Asia/Ho_Chi_Minh'
//   },
//   conferenceData: {
//     createRequest: {
//       requestId: 'heg-qemy-uvx',
//       conferenceSolutionKey: {
//         type: 'hangoutsMeet'
//       }
//     }
//   },
//   reminders: {
//     useDefault: true
//   },
//   attendees: [
//     { email: 'binhvxhg789@gmail.com' }
//   ],
//   sendNotifications: true
// }
// const calendar = google.calendar({ version: 'v3' })
// calendar.events.insert({
//   auth: oauth2Client,
//   calendarId: 'primary',
//   resource: event
// }, (err, res) => {
//   if (err) return console.log(`Lỗi: ${err}`)
//   console.log(`Đã tạo sự kiện: ${res.data.htmlLink}`)
//   console.log('res ne ', res)
// })

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


