const moment = require('moment')

const start = "2023-06-12T17:00:00.000Z"

const momentObj = moment(start);

// Lấy ngày hôm nay dạng 'yyyy-mm-dd'
const todayFormatted = momentObj.format('YYYY-MM-DD');

console.log(todayFormatted)
