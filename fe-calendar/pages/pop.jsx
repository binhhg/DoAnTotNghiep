import React, { useState, useRef, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import { UncontrolledPopover, PopoverBody, PopoverHeader } from 'reactstrap'
import Button from 'react-bootstrap/Button'
import Overlay from 'react-bootstrap/Overlay'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import rrulePlugin from '@fullcalendar/rrule'
import interactionPlugin from '@fullcalendar/interaction'
import 'bootstrap/dist/css/bootstrap.min.css'

import bootstrap5Plugin from '@fullcalendar/bootstrap5'

function Example () {
  const [eventTitle, setEventTitle] = useState('')
  const [popoverTarget, setPopoverTarget] = useState(null)

  const [show, setShow] = useState(false)
  const [event, setEvent] = useState(null)
  const [target, setTarget] = useState(null)
  const handleEventClick = (info) => {
    setEventTitle(info.event.title)
    setShow(true)
    setPopoverTarget(info.el)
  }
  const closePopover = () => {
    setPopoverTarget(null)
  }
  // const target = useRef(null)
  const ShowPopover = () => {
    console.log('vao daay ne ua alo')
    if (!target || !show) {
      return null
    }
    console.log('vao daay ne')
    return (
      <Overlay transition={'false'} target={target} show={'true'} placement="auto" rootClose onHide={() => {
        setShow(false)
      }}>
        <Popover className={'custom-popover'}>
          <Popover.Header as="h3">Popover right</Popover.Header>
          <Popover.Body>
            And here's some <strong>amazing</strong> content. It's very engaging.
            right?
          </Popover.Body>
        </Popover>
      </Overlay>
    )
  }
  const Popup = () => {

    console.log('heeeeaa', target)
    if (!target) {
      return null
    }
    console.log('heeee')
    return (
      <UncontrolledPopover show={show.toString()} placement="auto" target={target} rootClose onHide={() => setTarget(null)}>
        <PopoverHeader> hesola</PopoverHeader>
        <PopoverBody>
          áhdvashgdb
          <div>hesolo</div>
          <button>hehe</button>
        </PopoverBody>
      </UncontrolledPopover>
    )
  }
  return (
    <>
      <FullCalendar
        plugins={[rrulePlugin, bootstrap5Plugin, dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        // themeSystem={'bootstrap5'}
        initialView={'timeGridWeek'}
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'timeGridDay,timeGridWeek,dayGridMonth,listMonth'
        }}
        events={[
          {
            id: 'adasbhdgashbdhasd',
            title: 'event 1',
            start: '2023-06-17',
            // end: '2023-06-04T06:00:00+07',
            // color: 'red',
            createdBy: 'binh',
            summary: 'giôi thieu ne'
            // className: 'fc-rejected-event'
            // allDay: true
          }, {
            id: 'aaaa',
            title: 'event 4',
            start: '2023-06-12T06:30:00+07',
            end: '2023-06-12T09:30:00+07',
            extendedProps: { createdBy: 'Thuan', summary: 'giôi thieu ne' },
            duration: '05:00',
            allDay: false
          }
        ]}
        editable={'true'}
        height={'100vh'}
        selectable={'true'}
        eventClick={(info) => {
          // return (<Popup target={info.el} />)
          console.log(info)
          setShow(true)
          setTarget(info.el)
          // ReactDOM.render((<ShowPopover target={info.el} />), info.el)
        }}
      />
      {show && <ShowPopover/>}
    </>
  )
}

export default Example
