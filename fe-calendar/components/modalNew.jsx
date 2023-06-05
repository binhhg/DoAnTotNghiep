import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Row, Col, FormSelect, Popover, OverlayTrigger, Overlay } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import eventEmitter from '../utils/eventEmitter'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import 'react-datepicker/dist/react-datepicker.css'

export default function ModalNew ({ show, handel }) {
  const thuConfig = {
    0: {
      label: 'chủ nhật',
      key: 'SU',
      symbol: 'CN'
    },
    1: {
      label: 'thứ hai',
      key: 'MO',
      symbol: 'T2'
    },
    2: {
      label: 'thứ ba',
      key: 'TU',
      symbol: 'T3'
    },
    3: {
      label: 'thứ tư',
      key: 'WE',
      symbol: 'T4'
    },
    4: {
      label: 'thứ năm',
      key: 'TH',
      symbol: 'T5'
    },
    5: {
      label: 'thứ sáu',
      key: 'FI',
      symbol: 'T6'
    },
    6: {
      label: 'thứ bảy',
      key: 'SA',
      symbol: 'T7'
    }
  }
  const option = [
    { value: 1, label: 'Không lặp lại' },
    { value: 2, label: 'Hằng ngày' },
    { value: 3, label: 'tùy chỉnh... ' }
  ]
  const [data, setData] = useState({})
  const [optionSelect, setOptionSelect] = useState(option)
  const [inputText, setInputText] = useState('')
  const [array, setArray] = useState([])

  const handleInputChange = (e) => {
    setInputText(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addToArr()
    }
  }

  const addToArr = () => {
    setArray((prevArray) => [...prevArray, inputText])
    setInputText('')
  }

  const removeItem = (index) => {
    console.log('xoa')
    const newArray = [...array]
    newArray.splice(index, 1)
    setArray(newArray)
  }
  const handleCloseModal = () => {
    console.log('edit')
    handel(false)
  }
  const showDateTimePicker = () => {
    const filterPassedTime = (time) => {
      const currentDate = new Date()
      const selectedDate = new Date(time)

      return currentDate.getTime() < selectedDate.getTime()
    }
    return (
      <div className="grid grid-cols-2 gap-3">
        <div>
          <DatePicker
            selected={data.start}
            showTimeSelect={!data.allDay}
            timeFormat="HH:mm"
            dateFormat={!data.allDay ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
            showTimeInput
            timeInputFormat="HH:mm"
            minDate={data.start}
            className={'w-[90%]'}
          />
        </div>
        <div>
          <DatePicker
            selected={data.start}
            showTimeSelect={!data.allDay}
            timeFormat="HH:mm"
            dateFormat={!data.allDay ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
            showTimeInput
            timeInputFormat="HH:mm"
            minDate={data.start | data.end}
            className={'w-[90%]'}
          />
        </div>
      </div>
    )
  }
  const qq = () => {
    return (
      <Form onSubmit={e => e.preventDefault()}>
        <Form.Group controlId="formInput" className={'mb-3'}>
          <Form.Control
            type="text" placeholder="tieu de" defaultValue={data?.title}
            style={{ border: 'none', borderBottom: '2px solid blue' }}
          />
        </Form.Group>
        <Form.Group>
          {showDateTimePicker()}
        </Form.Group>
        <Row>
          <Form.Group className={'mb-2'}>
            <Form.Check type={'checkbox'} label={'Cả ngày'}/>
          </Form.Group>
          <Form.Group as={Col} md="5" className={'mb-2'}>
            <Select
              defaultValue={optionSelect[0]}
              options={optionSelect}
            />
          </Form.Group>
        </Row>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control type="email" placeholder="Thêm khách" value={inputText} onChange={handleInputChange}
                        onKeyPress={handleKeyPress}/>
          <ul>
            {array.map((item, index) => (
              <li key={index}>
                {item}{' '}
                <button onClick={() => removeItem(index)}>Xóa</button>
              </li>
            ))}
          </ul>
          {array.length ? <Form.Text>quyen khac moi</Form.Text> : null}
        </Form.Group>
      </Form>
    )
  }

  useEffect(() => {
    eventEmitter.on('showModalNew', result => {
      console.log('vao day dc ne', result)
      const cc = result.start.getDay()
      const thu = thuConfig[cc]
      const op = [...optionSelect]
      const cuoi = op.pop()
      const op2 = [
        {
          value: 4, label: 'Hàng tuần vào ' + thu.label, rrule: {
            freq: 'WEEKLY',
            dtstart: result.startStr,
            byweekday: [thu.key]
          }
        },
        {
          value: 5, label: 'Hàng tháng vào ' + thu.label + ' đầu tiên', rrule: {
            freq: 'WEEKLY',
            dtstart: result.startStr,
            byweekday: [thu.key],
            bysetpos: 1
          }
        },
        {
          value: 6, label: 'Các ngày trong tuần(thứ hai đến thứ 6', rrule: {
            freq: 'WEEKLY',
            dtstart: result.startStr,
            byweekday: ['MO', 'TU', 'WE', 'TH', 'FR']
          }
        }
      ]
      console.log('thu ne ', thu)
      setData(result)
      setOptionSelect([...op, ...op2, cuoi])
    })
  }, [])

  return (
    <>
      <Modal
        show={show} onHide={handleCloseModal}
        style={{ display: 'flow', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}
        scrollable
        dialogClassName="modal-vertical"
      >
        <Modal.Header closeButton/>
        <Modal.Body>{qq()}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            {data.title ? 'save' : 'edit'}
          </Button>
        </Modal.Footer>
      </Modal>
      {/*<Overlay show={show} placement={'auto'}>*/}
      {/*    <Popover id="popover-contained">*/}
      {/*        <Popover.Title as="h3">Popover Title</Popover.Title>*/}
      {/*        <Popover.Content>*/}
      {/*            This is the content of the popover.*/}
      {/*        </Popover.Content>*/}
      {/*    </Popover>*/}
      {/*</Overlay>*/}
    </>
  )
}
