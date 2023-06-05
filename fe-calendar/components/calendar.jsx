import React, { Fragment, useEffect, useState, useRef, forwardRef } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import rrulePlugin from '@fullcalendar/rrule'
import interactionPlugin from '@fullcalendar/interaction'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import eventEmitter from '../utils/eventEmitter'

const Calendar = forwardRef((props, ref) => {
  const [isClient, setIsClient] = useState(false)
  const { showModal } = props

  function handelClick (info) {
    eventEmitter.emit('showModalNew', info)
    showModal(info)
  }

  function eventClassNames (eventInfo) {
    const { event } = eventInfo
    if (event.title === 'event 4') return 'fc-rejected-event special-event'
  }

  // const renderEventContent = (eventInfo) => {
  //   const { event } = eventInfo;
  //
  //   if (event.title === 'event 4') {
  //     return (
  //         <div className="fc-rejected-event">
  //           <span className="event-title">{event.title}</span>
  //         </div>
  //     );
  //   }
  //
  //   return (
  //       <div >
  //         <span className="event-title">{event.title}</span>
  //       </div>
  //   );
  // };
  function daysi () {
    console.log('da vao day roi ne')
    eventEmitter.emit('testDaysi')
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true)
    }
  }, [])
  return (
    <Fragment>
      {isClient && <FullCalendar
        plugins={[rrulePlugin, bootstrap5Plugin, dayGridPlugin, timeGridPlugin, interactionPlugin,listPlugin]}
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
        events={[
          {
            id: 'adasbhdgashbdhasd',
            title: 'event 1',
            start: '2023-06-03',
            // end: '2023-06-04T06:00:00+07',
            // color: 'red',
            createdBy: 'binh',
            summary: 'giôi thieu ne'
            // className: 'fc-rejected-event'
            // allDay: true
          },
          {
            id: 'asdasdsa',
            title: 'event 3',
            start: '2023-06-05T01:30:00+07',
            extendedProps: { createdBy: 'Thuan', summary: 'giôi thieu ne' },
            duration: '05:00',
            allDay: false
          },
          {
            id: 'aaaa',
            title: 'event 4',
            start: '2023-05-28T06:30:00+07',
            end: '2023-05-28T09:30:00+07',
            extendedProps: { createdBy: 'Thuan', summary: 'giôi thieu ne' },
            duration: '05:00',
            allDay: false,
          },
          {
            title: 'Sự kiện hàng ngàyaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            // Hiển thị từ thứ 2 đến thứ 6
            // daysOfWeek: [1, 2, 3, 4, 5],
            // startTime: '2023-05-28T19:00:00',
            rrule: {
              freq: 'MONTHLY',
              dtstart: '2023-05-29',
              byweekday: ['MO'],
              until: '2023-08-28', // Đặt phút là 0 và 35
              bysetpos: 1
              // Loại bỏ ngày '2023-05-05'
            },
            // allDay: true,
            duration: '24:00',
            exdate: ['2023-06-11']

          }
        ]}
        editable={'true'}
        height={'100vh'}
        selectable={'true'}
        eventClassNames={eventClassNames}
        // eventContent={renderEventContent}
        // select={daysi}
        select={(info) => {
          console.log(info)
          handelClick(info)
        }}
        // eventClick={(info) => {
        //   // console.log(info.event)
        //   handelClick(info)
        // }}
      />
      }
    </Fragment>
  )
})

export default Calendar
