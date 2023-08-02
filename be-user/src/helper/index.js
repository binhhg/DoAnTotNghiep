module.exports = container => {
    const googleHelper = require('./googleHelper')(container)
    const calendarHelper = require('./calendarHelper')(container)
    return { googleHelper, calendarHelper}
}
