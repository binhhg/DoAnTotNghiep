const moment = require('moment')

const start = '2023-06-08T17:30:00+07:00'
const end = '2023-06-09T15:30:00+07:00'

// Chuyển chuỗi thành đối tượng Moment
const startMoment = moment(start)
const endMoment = moment(end)

// Tính toán duration
const duration = moment.duration(endMoment.diff(startMoment))

// Đổi đối tượng Moment thành chuỗi trong định dạng mong muốn
const startFormatted = startMoment.format()
const hours = Math.floor(duration.asHours())
const minutes = Math.floor(duration.asMinutes()) % 60

// Định dạng duration thành "hh:mm"
const durationFormatted = `${hours}:${minutes.toString().padStart(2, '0')}`
console.log('Start:', startFormatted)
console.log('Duration:', durationFormatted)
