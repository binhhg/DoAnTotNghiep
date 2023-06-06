import React, {useEffect, useState} from 'react'
import {Modal, Button, Form, Row, Col, FormSelect, Popover, OverlayTrigger, Overlay, ListGroup} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import eventEmitter from '../utils/eventEmitter'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import 'react-datepicker/dist/react-datepicker.css'

function validateGmail(Gmail) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(Gmail);
}

export default function ModalNew({show, handle}) {
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
        {value: 1, label: 'Không lặp lại'},
        {value: 2, label: 'Hằng ngày'},
        {value: 3, label: 'tùy chỉnh... '}
    ]
    const [data, setData] = useState({})
    const [optionSelect, setOptionSelect] = useState(option)
    const [title, setTitle] = useState('')
    const [start, setStart] = useState(new Date())
    const [end, setEnd] = useState(new Date())
    const [allDay, setAllDay] = useState(false)
    const [inputText, setInputText] = useState('')
    const [array, setArray] = useState([])
    const [showModal2, setShowModal2] = useState(false)

    const handleInputChange = (e) => {
        setInputText(e.target.value)
    }
    const changeTitle = (e) => {
        setTitle(e.target.value)
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addToArr()
        }
    }

    const addToArr = () => {
        if (validateGmail(inputText) ) {
            setArray((prevArray) => [...prevArray, inputText])
            setInputText('')
        }
    }

    const removeItem = (index) => {
        console.log('xoa')
        const newArray = [...array]
        newArray.splice(index, 1)
        setArray(newArray)
    }
    const handleCloseModal = () => {
        setInputText('')
        console.log('edit')
        handle(false)
    }
    const handleSave = () => {
        const data = {
            allDay,
            start,
            end,
            title,
            extendedProps: {
                attendees: array
            }
        }

        handle(false)
    }
    const handleChangeOption = (option) => {
        const value = option.value
        if (value === 3) {
            setShowModal2(true)
        }
    }
    useEffect(() => {
        console.log(start.getTime())
        console.log(end.getTime())
        if (start.getTime() >= end.getTime()) {
            setEnd(new Date(start.getTime() + 3600 * 1000))
        }
    }, [start])
    useEffect(() => {
        console.log(start.getTime())
        console.log(end.getTime())
        if (end.getTime() <= start.getTime()) {
            setStart(new Date(end.getTime() - 3600 * 1000))
        }
    }, [end])
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
            setStart(result.start)
            setEnd(result.end)
            setAllDay(result.allDay)
            setOptionSelect([...op, ...op2, cuoi])
        })
    }, [])
    const showDateTimePicker = () => {
        return (
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <DatePicker
                        selected={start}
                        showTimeSelect={!allDay}
                        timeFormat="HH:mm"
                        closeOnSelect
                        shouldCloseOnSelect
                        onChange={(date) => setStart(date)}
                        dateFormat={!allDay ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
                        showTimeInput
                        timeInputFormat="HH:mm"
                        className={'w-[90%]'}
                    />
                </div>
                <div>
                    <DatePicker
                        selected={end}
                        showTimeSelect={!allDay}
                        timeFormat="HH:mm"
                        onChange={(date) => setEnd(new Date(date))}
                        dateFormat={!allDay ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
                        showTimeInput
                        closeOnSelect
                        timeInputFormat="HH:mm"
                        className={'w-[90%]'}
                        minDate={start}
                    />
                </div>
            </div>
        )
    }
    const qq = () => {
        return (
            <Form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <Form.Group controlId="formInput">
                    <Form.Control
                        type="text" placeholder="tieu de" defaultValue={data?.title}
                        style={{border: 'none', borderBottom: '2px solid blue'}}
                        value={title}
                        onChange={changeTitle}
                    />
                </Form.Group>
                <Form.Group>
                    {showDateTimePicker()}
                </Form.Group>
                <Row>
                    <Form.Group>
                        <Form.Check checked={allDay} onChange={() => setAllDay(!allDay)} type={'checkbox'}
                                    label={'Cả ngày'}/>
                    </Form.Group>
                    <Form.Group className={'mb-2 w-full'}>
                        <Select
                            defaultValue={optionSelect[0]}
                            options={optionSelect}
                            className={''}
                            onChange={(option) => handleChangeOption(option)}
                        />
                    </Form.Group>
                </Row>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control type="email" placeholder="Thêm khách" value={inputText} onChange={handleInputChange}
                                  onKeyPress={handleKeyPress}/>
                    <ListGroup className={'mt-1'}>
                        {array.map((item, index) => (
                            <ListGroup.Item key={index} className="d-flex align-items-center">
                                <span>{item}</span>
                                <button className="ml-auto" onClick={() => removeItem(index)}>X</button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    {/*{array.length ? <Form.Text>quyen khac moi</Form.Text> : null}*/}
                </Form.Group>
            </Form>
        )

    }

    return (
        <>
            <Modal
                show={show} onHide={handleCloseModal}
                backdropClassName={!showModal2 ? 'custom-modal' : null}
                // style={{display: 'flow', alignItems: 'center', justifyContent: 'center', height: '50vh'}}
                scrollable
                // centered
                // fullscreen={'xl-down'}
            >
                <Modal.Header/>
                <div className={'min-h-[450px] h-fit px-3 py-3 overflow-auto'}>
                    {qq()}
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModal2} onHide={() => setShowModal2(false)}
                   centered
                   fullscreen={'xl-down'}
            >
                <Modal.Header closeButton/>
                <div>hesolo</div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}