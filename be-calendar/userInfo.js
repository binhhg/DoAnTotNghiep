const { OAuth2Client } = require('google-auth-library')
// const { google } = require('googleapis')
//
const { web } = require('./credentials.json')
// // Khởi tạo OAuth2Client với client ID và client secret của ứng dụng
const oauth2Client = new OAuth2Client({
  clientId: web.client_id,
  clientSecret: web.client_secret
})

async function verifyaa(token){
  try {

    const ticket = await oauth2Client.verifyIdToken({
      idToken: token
    })
    console.log(ticket)
    return ticket
  } catch (e) {
    console.log(e)
  }
}
verifyaa('eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMjgzOGMxYzhiZjllZGNmMWY1MDUwNjYyZTU0YmNiMWFkYjViNWYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMTcxMDk4MzI3OTgtdTJvYXNxb3NyM2ZhNDBuOW5rbWZ2bHVxNjV2cmtqYmQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyMTcxMDk4MzI3OTgtdTJvYXNxb3NyM2ZhNDBuOW5rbWZ2bHVxNjV2cmtqYmQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDM5NTAwNjU1Mjc0NjM0ODIwMjEiLCJoZCI6ImNhcnBsYS52biIsImVtYWlsIjoiYmluaHB0QGNhcnBsYS52biIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiYkRhT201ZXNYR2JyZXJ6bnM1OW83USIsIm5hbWUiOiJUaGFuaCBCw6xuaCBQaOG6oW0iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4YUtFR0JucUtMQmUyNGZsWmlpZ3RYMThidW1CdWRIVTBZOGhyby09czk2LWMiLCJnaXZlbl9uYW1lIjoiVGhhbmggQsOsbmgiLCJmYW1pbHlfbmFtZSI6IlBo4bqhbSIsImxvY2FsZSI6InZpIiwiaWF0IjoxNjg0MjMxNDUxLCJleHAiOjE2ODQyMzUwNTF9.u4SK2e4SmSq-AxQZ42zjLC009DDH7-vgSauzJPAszJacYy5rvTULO6HjbvnVq4UvUI4f5f59tSs2NjVhf4zpeoLuJfJDpw0S9EReOLyLSxTFxfFtVzLbsfECVYoehdMxdKXkPgaX3olOKKOUASc6g5e1QMzS1d4kYyfjVIKBJgza_RnSL_Lx4JXk3kiqdAtLSxu9lrRUuaLGfWd4Bs4ESwcR-ewUQdCF8uyzi3bE9cgq_NM1v_UVd56myR6fTjRcVnwiy-dhog_lLg1GBI2XZkj58j8kGiJ0yTRtf-mt9dBahOM1EBqwaIe0sRHevawZORqlkMgqG7pdLJc9kjKhXQ').then()
// // Set access token cho OAuth2Client
// oauth2Client.setCredentials({ access_token: 'ya29.a0AWY7CkkqRcHlwInGFztqmLADMCWO-ZuiBwjLBMILT9-TKtbUo7WjQhwHvZvl2kARnvOgU26ISy92cGPEjwjJBVHuA7v_tHpIhZVXZxDWX9-AbC1vI6I7JZ3m-dQitve3FCwTikQBDpZ2Yh46iJLaKySanO-aaCgYKAdMSARESFQG1tDrpJ9CLuwtNLwMPSNzpdmzrCg0163' })
//
// // Khởi tạo service object để gọi Google People API
// const people = google.people({
//   version: 'v1',
//   auth: oauth2Client
// })
//
// // Lấy thông tin người dùng
// people.people.get({
//   resourceName: 'people/me',
//   personFields: 'names,emailAddresses,photos,phoneNumbers,birthdays,genders'
// }, (err, res) => {
//   if (err) return console.error('Lỗi:', err)
//   const person = res.data
//
//   // Hiển thị thông tin người dùng
//   console.log(person)
// })
