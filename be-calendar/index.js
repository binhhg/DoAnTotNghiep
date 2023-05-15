const { google } = require('googleapis')
const { web } = require('./credentials.json')
const admin = require('firebase-admin')
const moment = require('moment')
const serviceAccount = require('./dulcet-coast-383615-firebase-adminsdk-xo3cc-678bd16117.json')

// const oauth2Client = new google.auth.OAuth2(web.client_id, web.client_secret, 'http://localhost:3000/signIn')
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
//   const data = await oauth2Client.getToken(token)
//   console.log('zzz', data)
// }
// getToken('4/0AbUR2VOSN7wld9NRY9ukqfKgguuaqSdLgBhZ_UdjSThsy1Obq7ewwClsyPXGEC0RdlOAcQ').then()
// oauth2Client.setCredentials({ refresh_token: 'APZUo0R8s7P_SJ_PHex1YBZA4nKob-wYuv85qXfqQnXBqQLUT-o6gUIXBor_5dwNdZUhsnrx1ACPOYPo5YUP2y0mZs8CN-YlHr48PWOuOZXpv1bytyvT4E6P0cQyXxaXAUxuAUvemsmYNHO3n7EiHPK0yDgPj2Qokuo1ARfXdgOYDfTHa7HkXddDqyGyx3briTtEH0A_Cxzv-3Ls9gA50MNeEG3I-wjNAM1eMd8G0ea_jWnuipicxYzVua38R7qDvpb2uPyaCVKmUbdWuMJVijFdzjUTqRtGnvS5vm1NCmbCYsv84pO3nVl1kpDTMMonRuE9Ewy17DFJFOolNu3oamUnGMPLopJB8to7xrXc96xFyWfv8jAJ9nM7enY7-aKTEuPViQWLW1OOA3lpzGJWVTWYnucvVmipP-lS5Js3AEVimcDcUfuw9xI' })
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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFiYjI2MzY4YTNkMWExNDg1YmNhNTJiNGY4M2JkYjQ5YjY0ZWM2MmYiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQmluaCBQaGFtIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FHTm15eFl5NGhUNFRRdlZBOENuMWdmMmRheXBEUGtRMksxbUlxZ3h5SmtKPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2R1bGNldC1jb2FzdC0zODM2MTUiLCJhdWQiOiJkdWxjZXQtY29hc3QtMzgzNjE1IiwiYXV0aF90aW1lIjoxNjg0MTcwMTc2LCJ1c2VyX2lkIjoiRXlxSTNsVWVWbFZsVTc5M1Q4RXh1TDkzdkkwMiIsInN1YiI6IkV5cUkzbFVlVmxWbFU3OTNUOEV4dUw5M3ZJMDIiLCJpYXQiOjE2ODQxNzAxNzYsImV4cCI6MTY4NDE3Mzc3NiwiZW1haWwiOiJiaW5odnhoZzc4OUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExNDMzMjI0MjI4OTgwNjA4NTI1NyJdLCJlbWFpbCI6WyJiaW5odnhoZzc4OUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.ozvexuLkZKaLWa2PUBxP05IJdJmZD9NFJvzESFLmxmxNKq7fLd0dvFpYGxQJH4igxbmZGLiBr3fPw5xtzzCDo_Of3kA9qKnreqnx-9Rts8HFtpqNLdxrINjQcaS33xB_ZH1EI3endYjSKLGo6RoZXbiu_0fEk5Tsvh1LYkgFg_dR8_oGKZLLdufUJuLiNAOpoQ_8QmZmYHF5bYL3oSDvL0Bk2RVqoZc6aOCUqLFL-KYv14e2h6VX6i2AM2DVTsarFko9gcq6SObWlzeHSZy-2i3ZZWcilm8joh3S1_EN_T3D6_10A_HOOwR2GmX-KJGZQfKoMbkIwOoJQLTpsKyWvw'
let cc

async function verifyIdToken (token) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    console.log(decodedToken)
    const uid = decodedToken.uid
    const qq = await admin.auth().createCustomToken(uid)
    console.log('qq', qq)
    return decodedToken
  } catch (error) {
    console.error('Error verifying ID token:', error)
    throw error
  }
}

verifyIdToken(token).then()
// User ID of the user to get the refresh token


