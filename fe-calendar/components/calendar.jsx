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
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import {Button} from "react-bootstrap";

const Calendar = forwardRef((props, ref) => {
    const [isClient, setIsClient] = useState(false)
    const [events, setEvents] = useState([])
    const {showModal, colorConfig} = props

    const [show, setShow] = useState(false)
    const [target, setTarget] = useState(null)
    const [offset, setOffset] = useState([])
    const [data, setData] = useState({})
    const color = {
        default: "#73BBAB"
    }
    const rruleToText = (start, end, duration, rrule) => {

    }
    const ShowPopover = () => {
        if (!show) {
            return null
        }
        return (
            <Overlay popperConfig={{
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: offset,
                        }
                    }
                ]
            }} target={target} show={show} placement="left" rootClose onHide={() => {
                setData({})
                setShow(false)
            }}>
                <Popover className={'custom-popover min-w-[400px] shadow-lg !border-none'}>
                    {/*<Popover.Header as="h3" style={{ display: "flex", justifyContent: "space-between" }}>*/}
                    {/*    */}
                    {/*</Popover.Header>*/}
                    <Popover.Body>
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                            width: '100%',
                        }}>
                            <div className={'cursor-pointer'}><i class="bi bi-pencil-fill"></i></div>
                            <div className={'cursor-pointer mx-3 '}><i class="bi bi-trash3-fill"></i></div>
                            <div className={'cursor-pointer hover:text-red-500'}><i class="bi bi-x-circle"></i></div>
                        </div>
                        <div className={'flex flex-col justify-start space-x-4'}>
                            <div className={'bg-red-400 w-4 h-4 rounded-md'}></div>
                            <div>
                                <div>{data?.title}</div>
                                <div>{data.start + ' - ' + data.end}</div>
                                {/*<a href={data.extendedProps.}>link google</a>*/}
                            </div>
                        </div>
                        <div className={'flex flex-col justify-start space-x-4'}>
                            <div className={'bg-red-400 w-4 h-4 rounded-md'}></div>
                            <div>DDaya la text</div>
                            <div>DDaya la text</div>
                            <div>DDaya la text</div>
                            <div>DDaya la text</div>
                            <div>DDaya la text</div>
                            <div>DDaya la text</div>
                            <div>DDaya la text</div>
                            <div>DDaya la text</div>
                            <div>DDaya la text</div>
                            <div>DDaya la text</div>
                        </div>
                    </Popover.Body>
                </Popover>
            </Overlay>
        )
    }
    useEffect(() => {
        if (colorConfig && Object.keys(colorConfig).length > 0) {
            color.default = colorConfig.defaultColor

            const aa = colorConfig.accountColor
            for (const va of aa) {
                color[`${va.accountId}`] = va.color
            }
            console.log(color)
            if (ref.current) {
                const zz = ref.current.getApi()
                zz.render()
                return () => {
                    zz.destroy();
                };
            }
        }
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
                themeSystem={'bootstrap5'}
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
                height={'100%'}
                selectable={'true'}
                eventClassNames={eventClassNames}
                // eventContent={renderEventContent}
                // select={daysi}
                select={(info) => {
                    if (show) {
                        setShow(!show)
                        setData({})
                    } else {
                        handelClick(info)
                    }
                }}
                eventClick={(info) => {
                    // return (<Popup target={info.el} />)
                    console.log(info)
                    setShow(!show)
                    setData(info.event)
                    // setTarget(info.el)
                    if (info.view.type === 'listMonth' || info.view.type === 'timeGridDay' || info.event?.extendedProps?.rrule) {
                        console.log('vao day')
                        // setOffset([`${info.jsEvent.screenX}px`, `${info.jsEvent.screenY}px`])
                        setTarget(null)
                        setOffset([info.jsEvent.screenY / 2, -info.jsEvent.screenX])
                    } else {
                        setOffset([])
                        setTarget(info.el)
                    }
                    // ReactDOM.render((<ShowPopover target={info.el} />), info.el)
                }}
                eventDidMount={(info) => {
                    const {extendedProps: cc} = info.event
                    const colorInfo = (colorConfig?.accountColor || []).find(item => item.accountId === cc?.booking?.accountId)
                    const ll = cc?.booking?.accountId
                    const co = color[`${ll}`]
                    const vcd = co ? co : (colorInfo?.color || colorConfig?.defaultColor || color['default'])
                    if (info.view.type !== 'listMonth' && info.view.type !== 'dayGridMonth') {
                        info.el.style.backgroundColor = vcd
                        info.el.style.border = 'none'
                    } else {
                        const dotEl = info.el.getElementsByClassName('fc-list-event-dot')[0]
                        if (dotEl) {
                            dotEl.style.borderColor = vcd
                        }
                        const dotEl1 = info.el.getElementsByClassName('fc-daygrid-event-dot')[0]
                        if (dotEl1) {
                            dotEl1.style.borderColor = vcd
                        }
                    }
                }
                }
            />
            }
            <div><ShowPopover/></div>
        </Fragment>
    )
})

export default Calendar
