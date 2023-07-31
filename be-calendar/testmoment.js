const moment = require('moment')

// const start = '2023-06-08T17:30:00+07:00'
// const end = '2023-06-09T15:30:00+07:00'
//
// // Chuyển chuỗi thành đối tượng Moment
// const startMoment = moment(start)
// const endMoment = moment(end)
//
// // Tính toán duration
// const duration = moment.duration(endMoment.diff(startMoment))
//
// // Đổi đối tượng Moment thành chuỗi trong định dạng mong muốn
// const startFormatted = startMoment.format()
// const hours = Math.floor(duration.asHours())
// const minutes = Math.floor(duration.asMinutes()) % 60
//
// // Định dạng duration thành "hh:mm"
// const durationFormatted = `${hours}:${minutes.toString().padStart(2, '0')}`
// console.log('Start:', startFormatted)
// console.log('Duration:', durationFormatted)

// // Tạo đối tượng Moment từ đối tượng Date hiện tại
// const currentTime = moment(new Date());
//
// // Chuyển đổi thành định dạng "YYYY-MM-DD HH:mm"
// const formattedTime = currentTime.format('YYYY-MM-DD HH:mm');

// console.log(`Thời gian định dạng "YYYY-MM-DD HH:mm": ${formattedTime}`);

const time = moment('2023-06-19T17:00:00Z')

const newTime = time.add(30, 'minutes')

// Lấy thời gian dạng 'hh:mm'

// console.log(newTime.toDate());
//
// function getDuration (start, end) {
//     if (!start || !end) {
//         return '00:00'
//     }
//     const startMoment = moment(start)
//     const endMoment = moment(end)
//     const duration = moment.duration(endMoment.diff(startMoment))
//     const days = duration.days()
//     const hours = duration.hours()
//     const minutes = duration.minutes()
//     const durationFormatted = `${hours + days * 24}:${minutes.toString().padStart(2, '0')}`
//     return durationFormatted
//
// }
// console.log(getDuration('2023-06-19T17:00:00.000Z','2023-06-20'))
// const a = moment('2023-06-19T17:00:00.000Z').format('YYYY-MM-DD')~
// console.log(a)

// const start = '2023-07-04T06:00:00.000Z'
// const utcTime = moment.utc(start).format('YYYYMMDDTHHmmss\\Z')
// const b = start.replace(/-/gi, '').replace(/:/gi, '')
// console.log(b)
// console.log(utcTime)

const a = '2023-07-31'
const b = moment(a).toJSON()
console.log(b)
