const qs = require('querystring')
const axios = require('axios')

const getRefreshToken = async (accessToken) => {
  const data = {
    client_id: '217109832798-u2oasqosr3fa40n9nkmfvluq65vrkjbd.apps.googleusercontent.com',
    client_secret: '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',
    refresh_token: accessToken,
    grant_type: 'refresh_token'
  }
  try {
    const {data: qq} = await axios.post(
      'https://oauth2.googleapis.com/token',
      data
    )
    console.log(qq)
    return qq
  } catch (e) {
    console.log(e)
  }
}
getRefreshToken('ya29.a0AWY7Cknyl-2koclDwe7sJA-IdxIFfBnAaaLvmyHRWGGAy9GuBJreWHf0UT-TGCp5uSPrzSnTw_eXaWaQLqumkDKb5a2fsRjUF3jP0JD6urOeg2xvfxPf7gugI1kOml8H92oWMln2LoRm3_X1TpRX2Kx_i4AfaCgYKAc8SARESFQG1tDrpaeW_9_ta7JJj0TPIpBnj8g0163').then()
