import React, {Fragment, useEffect, useState, useRef, forwardRef} from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import rrulePlugin from '@fullcalendar/rrule'
import interactionPlugin from '@fullcalendar/interaction'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import eventEmitter from '../utils/eventEmitter'
import {CalendarApi} from '../apis/calendar'

const Calendar = forwardRef((props, ref) => {
    const [isClient, setIsClient] = useState(false)
    const [events, setEvents] = useState([])
    const {showModal, colorConfig} = props
    const color = {
        default: '#73BBAB'
    }

    if (colorConfig && Object.keys(colorConfig).length > 0) {
        console.log('thay doi ', colorConfig)
        color.default = colorConfig.defaultColor

        const aa = colorConfig.accountColor
        aa.forEach(va => {
            color[`${va.accountId}`] = va.color
        })

        console.log('ccc', color)
    }

    useEffect(() => {

    }, [colorConfig])

    function handelClick(info) {
        eventEmitter.emit('showModalNew', info)
        showModal(info)
    }

    function eventClassNames(eventInfo) {
        const {event} = eventInfo
        if (event.title === 'event 4') return 'fc-rejected-event special-event'
    }

    const getData = async () => {
        try {
            const zz = await CalendarApi.getEvent()
            for (const va of zz) {
                va.extendedProps = {...va}
            }
            setEvents(zz)
        } catch (e) {
            setEvents([])
        }
    }
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsClient(true)
        }
        eventEmitter.on('addEvent', event => {
            console.log('vcllll ', event)
            const add = ref.current.getApi()
            for (const va of event) {
                va.extendedProps = {...va}
                add.addEvent(va)
            }
        })
        getData()

    }, [])
    return (
        <Fragment>
            {isClient && <FullCalendar
                plugins={[rrulePlugin, bootstrap5Plugin, dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                // themeSystem={'bootstrap5'}
                initialView={'timeGridWeek'}
                headerToolbar={{
                    start: 'today prev,next',
                    center: 'title',
                    end: 'timeGridDay,timeGridWeek,dayGridMonth,listMonth'
                }}
                customButtons={
                    {
                        today: {
                            text: 'Hôm nay',
                            bootstrapFontAwesome: false,
                            themeIcon: 'red',
                            click: () => {
                                ref.current.getApi().today()
                                eventEmitter.emit('clickToday', {})
                            }
                        },
                        timeGridDay: {
                            text: 'Ngày',
                            click: () => {
                                ref.current.getApi().changeView('timeGridDay')
                            }
                        },
                        timeGridWeek: {
                            text: 'Tuần',
                            click: () => {
                                ref.current.getApi().changeView('timeGridWeek')
                            }
                        },
                        dayGridMonth: {
                            text: 'Tháng',
                            click: () => {
                                ref.current.getApi().changeView('dayGridMonth')
                            }
                        }
                    }
                }
                ref={ref}
                events={events}
                // events={[
                //   {
                //     id: 'adasbhdgashbdhasd',
                //     title: 'event 1',
                //     start: '2023-06-03',
                //     // end: '2023-06-04T06:00:00+07',
                //     // color: 'red',
                //     createdBy: 'binh',
                //     summary: 'giôi thieu ne'
                //     // className: 'fc-rejected-event'
                //     // allDay: true
                //   },
                //   // {
                //   //   id: 'asdasdsa',
                //   //   title: 'event 3',
                //   //   start: '2023-06-05T05:30:00',
                //   //   extendedProps: { createdBy: 'Thuan', summary: 'giôi thieu ne' },
                //   //   duration: '05:00',
                //   //   allDay: false
                //   // },
                //   // {
                //   //   id: 'asdasdsaaaaaa',
                //   //   title: 'event 3 1',
                //   //   start: '2023-06-05T05:30:00',
                //   //   extendedProps: { createdBy: 'Thuan', summary: 'giôi thieu ne' },
                //   //   duration: '05:00',
                //   //   allDay: 1
                //   // },
                //   {
                //     id: 'aaaa',
                //     title: 'event 4',
                //     start: '2023-05-28T06:30:00+07',
                //     end: '2023-05-28T09:30:00+07',
                //     extendedProps: { createdBy: 'Thuan', summary: 'giôi thieu ne' },
                //     duration: '05:00',
                //     allDay: false
                //   },
                //   {
                //     id: 'cnbxasjsad',
                //     title: 'event dac biet',
                //     // start: '2023-06-10',
                //     // end: '2023-06-10T09:30:00+07',
                //     // allDay: true,
                //     rrule: {
                //       freq: 'WEEKLY',
                //       dtstart: '2023-06-10T00:30:00Z',
                //       byweekday: ['MO', 'TU', 'WE', 'TH', 'FR']
                //       // Loại bỏ ngày '2023-05-05'
                //     },
                //     duration: '04:00'
                //   },
                //   {
                //     title: 'Sự kiện hàng ngàyaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                //     // Hiển thị từ thứ 2 đến thứ 6
                //     // daysOfWeek: [1, 2, 3, 4, 5],
                //     // startTime: '2023-05-28T19:00:00',
                //     extendedProps: {
                //       rrule: {
                //         freq: 'MONTHLY',
                //         dtstart: '2023-05-29',
                //         byweekday: ['MO'],
                //         until: '2023-08-28', // Đặt phút là 0 và 35
                //         bysetpos: 1
                //         // Loại bỏ ngày '2023-05-05'
                //       },
                //       // allDay: true,
                //       duration: '24:00',
                //       exdate: ['2023-06-11']
                //     },
                //     rrule: {
                //       freq: 'MONTHLY',
                //       dtstart: '2023-05-29',
                //       byweekday: ['MO'],
                //       until: '2023-08-28', // Đặt phút là 0 và 35
                //       bysetpos: 1
                //       // Loại bỏ ngày '2023-05-05'
                //     },
                //     // allDay: true,
                //     duration: '24:00',
                //     exdate: ['2023-06-11']
                //
                //   }
                // ]}
                editable={'true'}
                height={'100vh'}
                selectable={'true'}
                eventClassNames={eventClassNames}
                // eventContent={renderEventContent}
                // select={daysi}
                select={(info) => {
                    handelClick(info)
                }}
                // eventClick={(info) => {
                //   info.el.popover({
                //     container: 'body',
                //     content: '<p>he so lo </p>',
                //     html: true,
                //     trigger: 'click'
                //   })
                //   info.el.popover('show')
                // }}
                eventDidMount={(info) => {
                    console.log(info)
                    const {extendedProps: cc} = info.event
                    // if (cc?.booking?.accountId) {
                    //     const a = cc.booking.accountId
                    //     info.el.style.backgroundColor = color[a] ? color[a] : color['default']
                    //     const dotEl = info.el.getElementsByClassName('fc-list-event-dot')[0]
                    //     if (dotEl) {
                    //         dotEl.style.borderColor = color[a] ? color[a] : color['default']
                    //     }
                    // } else {
                    //     info.el.style.backgroundColor =color['default']
                    //     const dotEl = info.el.getElementsByClassName('fc-list-event-dot')[0]
                    //     if (dotEl) {
                    //         dotEl.style.borderColor = color['default']
                    //     }
                    // }
                    if (info.view.type !== 'listMonth' && info.view.type !== 'dayGridMonth') {
                        console.log('vao day ne', cc, color)
                        const colorInfo = colorConfig.accountColor.find(item => item.accountId === cc?.booking?.accountId)
                        info.el.style.backgroundColor = color[cc?.booking?.accountId] ? color[cc?.booking?.accountId] : (colorInfo.color || color['default'])
                    } else {
                        const dotEl = info.el.getElementsByClassName('fc-list-event-dot')[0]
                        if (dotEl) {
                            const colorInfo = colorConfig.accountColor.find(item => item.accountId === cc?.booking?.accountId)
                            dotEl.style.borderColor = color[cc?.booking?.accountId] ? color[cc?.booking?.accountId] : (colorInfo.color || color['default'])
                        }
                        const dotEl1 = info.el.getElementsByClassName('fc-daygrid-event-dot')[0]
                        if (dotEl1) {
                            const colorInfo = colorConfig.accountColor.find(item => item.accountId === cc?.booking?.accountId)
                            dotEl1.style.borderColor = color[cc?.booking?.accountId] ? color[cc?.booking?.accountId] : (colorInfo.color || color['default'])
                        }
                    }
                }
                }
            />
            }
        </Fragment>
    )
})

export default Calendar
