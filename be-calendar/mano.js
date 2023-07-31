const axios = require('axios').default

async function qqq(){
    try {
        const qq = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events?syncToken=true',{
            Authorization: 'Bearer ya29.a0AbVbY6OmWf0pdVS3IicoeHMjiB0ICjPqyJK-JK5BuGBeRttVGCnj0AnUCuzk37K98Gk9-fSLYhJBCQTvf1GBSdmU8LJIzFcaF5hf_o0oYxh0wSwQEfg5hGLtvHxVlKPlKw1_zT540AfN1kJYo8gS2uEn-PC5Ar2NaCgYKASwSARESFQFWKvPlpxR_0EpZGG9k4hf3tNMVmw0167'
        })
        console.log(qq)
    } catch (e) {
        console.log(e.response.data.error)
    }
}

qqq().then()
