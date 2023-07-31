const {datetime, RRule, RRuleSet, rrulestr} = require('rrule')
const qq = 'RRULE:FREQ=WEEKLY;WKST=SU;COUNT=14;INTERVAL=2;BYDAY=WE,TH,TU,SU'
// const a = rrulestr( qq)
// console.log(a)
// const {options} = a
// console.log(options)


const zz = qq.replace('RRULE:', '').split(';')

const rrule = {}
for (const z of zz) {
    const dm = z.split('=')
    if (dm[0] === 'BYDAY') {
        console.log(dm[1])
        if (+(dm[1]).charAt(0)) {
            rrule['bysetpos'] = +(dm[1]).charAt(0)
            rrule['byweekday'] = dm[1].slice(1).split(',')
        } else {
            rrule['byweekday'] = dm[1].split(',')
        }

    } else {
        rrule[`${dm[0].toLowerCase()}`] = +dm[1] ? +dm[1] : dm[1]
    }
}
console.log(rrule)
