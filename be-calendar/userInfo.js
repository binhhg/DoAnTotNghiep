const { OAuth2Client } = require('google-auth-library')
const { google } = require('googleapis')

const { web } = require('./credentials.json')
// Khởi tạo OAuth2Client với client ID và client secret của ứng dụng
const oauth2Client = new OAuth2Client({
  clientId: web.client_id,
  clientSecret: web.client_secret
})

// Set access token cho OAuth2Client
oauth2Client.setCredentials({ access_token: 'ya29.a0AWY7CkkqRcHlwInGFztqmLADMCWO-ZuiBwjLBMILT9-TKtbUo7WjQhwHvZvl2kARnvOgU26ISy92cGPEjwjJBVHuA7v_tHpIhZVXZxDWX9-AbC1vI6I7JZ3m-dQitve3FCwTikQBDpZ2Yh46iJLaKySanO-aaCgYKAdMSARESFQG1tDrpJ9CLuwtNLwMPSNzpdmzrCg0163' })

// Khởi tạo service object để gọi Google People API
const people = google.people({
  version: 'v1',
  auth: oauth2Client
})

// Lấy thông tin người dùng
people.people.get({
  resourceName: 'people/me',
  personFields: 'names,emailAddresses,photos,phoneNumbers,birthdays,genders'
}, (err, res) => {
  if (err) return console.error('Lỗi:', err)
  const person = res.data

  // Hiển thị thông tin người dùng
  console.log(person)
})
