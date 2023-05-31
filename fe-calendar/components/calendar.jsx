import React, { Fragment, useEffect, useState, useRef, forwardRef } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
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
    eventEmitter.emit('showModalNew', info.event)
    showModal()
  }
  function eventClassNames (eventInfo){
    const { event } = eventInfo
    if(event.title === 'event 4') return 'fc-rejected-event special-event'
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
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true)
    }
  }, [])
  return (
    <Fragment>
      {isClient && <FullCalendar
        plugins={[rrulePlugin, bootstrap5Plugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
        // themeSystem={'bootstrap5'}
        initialView={'timeGridWeek'}
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'timeGridDay,timeGridWeek,dayGridMonth'
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
            date: '2023-05-27',
            // color: 'red',
            createdBy: 'binh',
            summary: 'giôi thieu ne',
            // className: 'fc-rejected-event'
          },
          {
            id: 'cghvdhsbkahdgawhf',
            title: 'event 2',
            date: '2023-05-25',
            extendedProps: { createdBy: 'Thuan', summary: 'giôi thieu ne' }
          },
          {
            id: 'asdasdsa',
            title: 'event 3',
            date: '2023-05-28T01:30:00+07',
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
            rdate: ['2023-05-29T19:00:00'],
            rrule: {
              freq: 'WEEKLY',
              dtstart: '2023-05-28T19:00:00',
              interval: 1,
              byweekday: ['su'],
              until: '2023-08-26', // Đặt phút là 0 và 35
              bysecond: 0
              // Loại bỏ ngày '2023-05-05'
            },
            duration: '2:00',
            exdate: ['2023-06-04']

          }
        ]}
        editable={'true'}
        height={'100vh'}
        selectable={'true'}
        eventClassNames={eventClassNames}
        // eventContent={renderEventContent}
        // select={() => {
        //     console.log('oke')
        // }}
        select={(info) => {
          console.log(info)
          showModal()
        }}
        eventClick={(info) => {
          console.log(info.event)
          handelClick(info)
        }}
      />
      }
    </Fragment>
  )
})

export default Calendar
