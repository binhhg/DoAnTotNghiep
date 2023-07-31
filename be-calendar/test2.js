const { OAuth2Client } = require('google-auth-library')
const { web } = require('./credentials.json')
const oAuth2Client = new OAuth2Client(web.client_id, web.client_secret,)

async function getAccessTokenFromRefreshToken() {
  const oAuth2Client = new OAuth2Client(web.client_id, web.client_secret);

  oAuth2Client.setCredentials({
    refresh_token: '1//0g2dQRsrXjZqsCgYIARAAGBASNwF-L9IrXUj7b0OcrboHSbIJ6s_cmvHcsw7ChPvLOaTf8CPb23uaOgMXlGR4khJiGs7tWm-bNk4',
  });

  try {
    const { token } = await oAuth2Client.getAccessToken();
    console.log(token);
    return token;
  } catch (error) {
    console.error('Error getting Access Token:', error.message);
    return null;
  }
}

getAccessTokenFromRefreshToken().then();
