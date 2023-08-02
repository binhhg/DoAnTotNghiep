const axios = require('axios').default
module.exports = container => {
    const {urlConfig: {calendar}} = container.resolve('config')
    const accessToken = process.env.INTERNAL_TOKEN || '123'
    const removeAll = async (body) => {
        const options = {
            url: `${calendar}/internal/removeAll`,
            method: 'POST',
            headers: {'x-access-token': accessToken},
            data: body
        }
        const {data} = await axios(options)
        return data
    }
    return {
        removeAll
    }
}
