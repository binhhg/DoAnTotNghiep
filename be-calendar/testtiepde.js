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
    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=AIzaSyBS9wmuSJ6zPs3QIsFSbZueRLNkj-Nk918`,
      qs.stringify(data)
    )
    console.log(response)
    return response.data.refresh_token
  } catch (e) {
    console.log(e)
  }
}
getRefreshToken('ya29.a0AWY7Cklg7KDpbRLquANT0LEJMvWSsLS2ovooxK0sk_hF2e7Fb1xTjMA8NU_3WmAryxpjkkAZzKuo5z6WQ97wbaFLhbC2xFEElV0oWnfQWoUn_V3p4UvmkaHGa1VjENXhXykqyBx5Ews-_7nTRUnZmYwTkrLwaCgYKATwSAQ4SFQG1tDrpC58m-qnEQ7IwhkqpW5MllA0163').then()
