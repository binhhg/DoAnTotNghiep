import React, {Fragment, useEffect, useState} from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import rrulePlugin from '@fullcalendar/rrule'
import interactionPlugin from '@fullcalendar/interaction'
import 'bootstrap/dist/css/bootstrap.min.css'
import {datetime, RRule, RRuleSet, rrulestr} from 'rrule'
import {useRef} from "react/index";

export default function Calendar() {
    const test = useRef(null)
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsClient(true)
        }
    }, [])
    return (
        <Fragment>
            <button onClick={()=> {
                let calendar = test.current.getApi()
                calendar.gotoDate('2023-06-14')
            }}>hehehe</button>
            {isClient && <FullCalendar
                plugins={[rrulePlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    start: "today prev,next",
                    center: 'title',
                    end: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                ref={test}
                events={[
                    {
                        id: "adasbhdgashbdhasd",
                        title: 'event 1',
                        date: '2023-05-27',
                        color: 'red',
                        createdBy: 'binh',
                        summary: 'giôi thieu ne'
                    },
                    {
                        id: "cghvdhsbkahdgawhf",
                        title: 'event 2',
                        date: '2023-05-25',
                        extendedProps: {createdBy: 'Thuan', summary: 'giôi thieu ne'}
                    },
                    {
                        id: "asdasdsa",
                        title: 'event 3',
                        date: '2023-05-28T01:30:00+07',
                        extendedProps: {createdBy: 'Thuan', summary: 'giôi thieu ne'},
                        duration: '05:00',
                        allDay: false
                    },
                    {
                        id: "aaaa",
                        title: 'event 4',
                        start: '2023-05-28T06:30:00+07',
                        end: '2023-05-28T09:30:00+07',
                        extendedProps: {createdBy: 'Thuan', summary: 'giôi thieu ne'},
                        duration: '05:00',
                        allDay: false
                    },
                    {
                        title: 'Sự kiện hàng ngày',
                        // Hiển thị từ thứ 2 đến thứ 6
                        // daysOfWeek: [1, 2, 3, 4, 5],
                        rdate: ['2023-05-29T19:00:00'],
                        rrule: {
                            freq: 'WEEKLY',
                            dtstart: '2023-05-28T19:00:00',
                            interval: 1,
                            byweekday: ['su'],
                            until: '2023-08-26', // Đặt phút là 0 và 35
                            bysecond: 0,
                            // Loại bỏ ngày '2023-05-05'
                        },
                        duration: '2:00',
                        exdate: ['2023-06-04']

                    }
                ]}
                editable={'true'}
                height={'100vh'}
                selectable={'true'}
                // select={() => {
                //     console.log('oke')
                // }}
                // select={(time) => {
                //     // return new Popover(time,{
                //     //     title: 'heehe',
                //     //     placement: 'auto',
                //     //     trigger: 'click',
                //     //     content: "<p>he so lo</p>",
                //     //     html:true
                //     // })
                //     console.log('oke ne')
                // }}
                // eventClick={(info) => console.log('hehe thu cai, ', info.event)}
            />}
        </Fragment>
    )
}
