import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

export default function Calendar() {
    return (
        <FullCalendar
            plugins={[ dayGridPlugin ]}
            initialView="dayGridMonth"
            weekends={false}
            events={[
                { title: 'event 1', date: '2023-05-27' },
                { title: 'event 2', date: '2019-05-25' }
            ]}
        />
    )
}
