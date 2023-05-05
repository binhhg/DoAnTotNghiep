const axios = require('axios').default

async function getRefreshToken () {
  try {
    const response = await axios.post(
      'https://oauth2.googleapis.com/v3/token',
      {
        client_id: '217109832798-u2oasqosr3fa40n9nkmfvluq65vrkjbd.apps.googleusercontent.com',
        client_secret: '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',
        refresh_token: 'ya29.a0AWY7CknnYRifvYdnj_8zDrGCekhUhoTqHDgetOf3OPaK6bcjUqop_uNSL_WAQ8oMx46YN61cuK8SBYpYzeD0rlRTqUenFL4SplCVTiwJuNqlYrzrLz5IwcZ7zqli2-8HtJMfNZWukKih92nAYlkr6VRHydjsaCgYKAf4SARESFQG1tDrpzG6dsWSb6WMyXq8b2RMMwA0163',
        grant_type: 'refresh_token'
      }
    )
    const data = response.data
    console.log(data)
    return data.refresh_token
  } catch (error) {
    console.error(error)
  }
}

const getRefreshToken1 = async () => {
  const response = await axios.post(
    `https://securetoken.googleapis.com/token?key=AIzaSyBS9wmuSJ6zPs3QIsFSbZueRLNkj-Nk918`,
    {
      grant_type: 'authorization_code',
      code: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImM5YWZkYTM2ODJlYmYwOWViMzA1NWMxYzRiZDM5Yjc1MWZiZjgxOTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjE3MTA5ODMyNzk4LXUyb2FzcW9zcjNmYTQwbjlua21mdmx1cTY1dnJramJkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjE3MTA5ODMyNzk4LXUyb2FzcW9zcjNmYTQwbjlua21mdmx1cTY1dnJramJkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE0MzMyMjQyMjg5ODA2MDg1MjU3IiwiZW1haWwiOiJiaW5odnhoZzc4OUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlZUdXVfbkJHN25lcDBSRndvNlZjVEEiLCJpYXQiOjE2ODMxMDIzNTQsImV4cCI6MTY4MzEwNTk1NH0.gpfiSA3D4kkRg45QyXoxqtg1PJxBUKKmEjJcxyRCgoeMKOBmseWvO6vvsjXsvGPn6ZZFikkxQusio1u8bVXQzw2z1Em0tYZKxyceFDz0u5_tJlVH13GXqlUGIE0JuNup4nx_bzbzi0pwLlp1SiE74uwT6rJq4Wan1qAQSAI6tDxiflOtG3vyCpmHqJ9jK2L9CrZI-ENJDxxDqVn8tudyhY5W300gST5Q8wFtbb3HtNCopZNw8cRdaSsdhI6Ekkg6_VzuLVQj0FyqdWq2XeZK5ULMaRiRQuOsSq8YwhjqtNAjGp5J53M2fKbII4Qq7XBog_UHtpUiAiE4NANRZe-pIw',
      client_id: '217109832798-u2oasqosr3fa40n9nkmfvluq65vrkjbd.apps.googleusercontent.com',
      client_secret: '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',
      redirect_uri: 'https://dulcet-coast-383615.firebaseapp.com/__/auth/handler',
    }
  )
  const qq = 123
  console.log(response)
  return response.data.refresh_token
}
const exchangeRefreshToken = async () => {
  const data = {
    client_id: '217109832798-u2oasqosr3fa40n9nkmfvluq65vrkjbd.apps.googleusercontent.com',
    client_secret: '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',
    grant_type: 'authorization_code',
    code: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM5YWZkYTM2ODJlYmYwOWViMzA1NWMxYzRiZDM5Yjc1MWZiZjgxOTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjE3MTA5ODMyNzk4LXUyb2FzcW9zcjNmYTQwbjlua21mdmx1cTY1dnJramJkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjE3MTA5ODMyNzk4LXUyb2FzcW9zcjNmYTQwbjlua21mdmx1cTY1dnJramJkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE0MzMyMjQyMjg5ODA2MDg1MjU3IiwiZW1haWwiOiJiaW5odnhoZzc4OUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlZUdXVfbkJHN25lcDBSRndvNlZjVEEiLCJpYXQiOjE2ODMxMDIzNTQsImV4cCI6MTY4MzEwNTk1NH0.gpfiSA3D4kkRg45QyXoxqtg1PJxBUKKmEjJcxyRCgoeMKOBmseWvO6vvsjXsvGPn6ZZFikkxQusio1u8bVXQzw2z1Em0tYZKxyceFDz0u5_tJlVH13GXqlUGIE0JuNup4nx_bzbzi0pwLlp1SiE74uwT6rJq4Wan1qAQSAI6tDxiflOtG3vyCpmHqJ9jK2L9CrZI-ENJDxxDqVn8tudyhY5W300gST5Q8wFtbb3HtNCopZNw8cRdaSsdhI6Ekkg6_VzuLVQj0FyqdWq2XeZK5ULMaRiRQuOsSq8YwhjqtNAjGp5J53M2fKbII4Qq7XBog_UHtpUiAiE4NANRZe-pIw",
    access_token: 'ya29.a0AWY7CknnYRifvYdnj_8zDrGCekhUhoTqHDgetOf3OPaK6bcjUqop_uNSL_WAQ8oMx46YN61cuK8SBYpYzeD0rlRTqUenFL4SplCVTiwJuNqlYrzrLz5IwcZ7zqli2-8HtJMfNZWukKih92nAYlkr6VRHydjsaCgYKAf4SARESFQG1tDrpzG6dsWSb6WMyXq8b2RMMwA0163'
  }
  const response = await axios.post(
    'https://oauth2.googleapis.com/token',
    data,
    {
      headers: {
        Authorization: `Bearer ya29.a0AWY7CknnYRifvYdnj_8zDrGCekhUhoTqHDgetOf3OPaK6bcjUqop_uNSL_WAQ8oMx46YN61cuK8SBYpYzeD0rlRTqUenFL4SplCVTiwJuNqlYrzrLz5IwcZ7zqli2-8HtJMfNZWukKih92nAYlkr6VRHydjsaCgYKAf4SARESFQG1tDrpzG6dsWSb6WMyXq8b2RMMwA0163`,
        'Content-Type': 'application/json',
      },
    }
  )
  console.log(response)
  return response.data.refresh_token
}
exchangeRefreshToken().then()
