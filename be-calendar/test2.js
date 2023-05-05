const { OAuth2Client } = require('google-auth-library')
const { web } = require('./credentials.json')
const oAuth2Client = new OAuth2Client(web.client_id, web.client_secret, 'http://localhost:3001/signin')

const getRefreshToken = async (accessToken) => {
  const cc = await oAuth2Client.refreshToken(accessToken)
  console.log(cc)
  return cc
}
getRefreshToken('ya29.a0AWY7CkmujLk-8FgHpxkVLkxNhSrUxfwzF8NMJFSshX_pI9KNvvo57XRSNIFvUOUiWRh_qTAQxXvi30qtU-tEiUuD48uMk18WDkOO_rlkrn9LpDN7L66JJo2uVKCfqGYpzpm-O3l7WGH-a1UZEonQGN5_l4vQaCgYKAbcSAQ4SFQG1tDrpz2TJDOVhIqKSO7QJftj3Nw0163').then()
