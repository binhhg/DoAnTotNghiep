const { OAuth2Client } = require('google-auth-library')

async function getRefreshTokenFromAccessToken (accessToken) {
  const client = new OAuth2Client('217109832798-u2oasqosr3fa40n9nkmfvluq65vrkjbd.apps.googleusercontent.com', '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')
  client.setCredentials({ access_token: accessToken })

  const data = await client.refreshAccessToken()

  return data
}

getRefreshTokenFromAccessToken('ya29.a0Ael9sCMTawZTK6GyOwYUWvZ9GYVCmiateFyI3J1PCKcDxOoHRlt8IToB-MUCOJMwZN4ak5zM8dEfhWEgXYeBOF7FosVq5wiW3aKVD3KQgltgHfoPMBqN_KVVj5W8YlEdQhsHhemTzF04zmb9Ly-DhWEe3PTNaCgYKAd4SAQ4SFQF4udJhppTooDaC_Se-cxW9Do5QrQ0163').then()
