import React, {useEffect, useState} from 'react'
import {Modal, Button, Form, Row, ListGroup} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import eventEmitter from '../utils/eventEmitter'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import 'react-datepicker/dist/react-datepicker.css'
import {UserApi} from '../apis/user'
import {CalendarApi} from '../apis/calendar'

const moment = require('moment')

function validateGmail(Gmail) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return pattern.test(Gmail)
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
        {value: 2, label: 'Hằng ngày', rrule: {freq: 'DAILY'}},
        {value: 3, label: 'tùy chỉnh... '}
    ]
    const [data, setData] = useState({})
    const [optionSelect, setOptionSelect] = useState(option)
    const [title, setTitle] = useState('')
    const [start, setStart] = useState(new Date())
    const [end, setEnd] = useState(new Date())
    const [location, setLocation] = useState('')
    const [allDay, setAllDay] = useState(false)
    const [inputText, setInputText] = useState('')
    const [attendees, setAttendees] = useState([])
    const [accounts, setAccounts] = useState([])
    const [description, setDescription] = useState('')
    const [mailOption, setMailOption] = useState([])
    const [optionSelected, setOptionSelected] = useState(option[0])
    const [showModal2, setShowModal2] = useState(false)
    const [errMsg, setErrMsg] = useState('')

    const handleInputChange = (e) => {
        setInputText(e.target.value)
    }
    const changeTitle = (e) => {
        setTitle(e.target.value)
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (inputText) {
                setErrMsg('')
            } else {
                setErrMsg('Loi')
            }

            e.preventDefault()
            addToArr()
        }
    }

    const addToArr = () => {
        if (validateGmail(inputText) && !attendees.includes(inputText) && inputText !== accounts[0]?.label) {
            setAttendees((prevArray) => [...prevArray, inputText])
            setInputText('')
        }
    }

    const removeItem = (index) => {
        console.log('xoa')
        const newArray = [...attendees]
        newArray.splice(index, 1)
        setAttendees(newArray)
    }
    const handleCloseModal = () => {
        setInputText('')
        console.log('edit')
        handle(false)
    }
    const handleSave = async () => {
        try {
            const body = {
                allDay,
                start,
                end,
                title,
                location,
                description,
                accounts,
                attendees
            }
            console.log(optionSelected, 'zzz')
            if (optionSelected?.rrule) {
                body.rrule = optionSelected.rrule
                body.rrule.dtstart = start
            }
            handle(false)
            const {data: zz} = await CalendarApi.addCalendar(body)
            console.log('zzzzz ', zz)
            eventEmitter.emit('addEvent', zz)
        } catch (e) {
            console.log(e)
            handle(false)
        }
    }
    const handleChangeOption = (op) => {
        const value = op.value
        if (value === 3) {
            setShowModal2(true)
        }
        setOptionSelected(op)
    }
    const handleSetAllDay = () => {
        if (!allDay) {
            const modifiedDateStart = moment(start).set({hour: 0, minute: 0, second: 0})
            setStart(modifiedDateStart.toDate())
            setEnd(modifiedDateStart.add(1, 'day').toDate())
        }
        setAllDay(!allDay)
    }
    const handleChangeMail = (option) => {
        setAccounts(option)
        if (option.length !== 1) {
            setAttendees([])
        }
    }
    useEffect(() => {
        if (start.getTime() >= end.getTime()) {
            if (allDay) {
                setEnd(new Date(start.getTime() + 3600 * 1000 * 24)) // theo ngay
            } else {
                setEnd(new Date(start.getTime() + 3600 * 1000))
            }
        }
    }, [start])
    useEffect(() => {
        if (end.getTime() <= start.getTime()) {
            if (allDay) {
                setStart(new Date(end.getTime() - 3600 * 1000 * 24))
            } else {
                setStart(new Date(end.getTime() - 3600 * 1000))
            }
        }
    }, [end])
    const getAccount = async () => {
        try {
            const data = await UserApi.getAccount()
            for (const va of data) {
                va.value = va._id
                va.label = va.email
            }
            setMailOption(data)
        } catch (e) {
            setMailOption([])
        }
    }
    useEffect(() => {
        getAccount()
    }, [])
    const appearances = {
        1: 'đầu tiên',
        2: 'thứ hai',
        3: 'thứ ba',
        4: 'thứ tư',
        5: 'thứ năm'
    }
    const appearance = (date) => {
        const dayOfMonth = date.getDate()
        const ordinalDayOfWeek = Math.ceil(dayOfMonth / 7)
        return {number: ordinalDayOfWeek, text: appearances[ordinalDayOfWeek]}
    }
    useEffect(() => {
        eventEmitter.on('showModalNew', result => {
            const cc = result.start.getDay()
            const app = appearance(result.start)
            const thu = thuConfig[cc]
            const op = [...option]
            const cuoi = op.pop()
            const op2 = [
                {
                    value: 4,
                    label: 'Hàng tuần vào ngày ' + thu.label,
                    rrule: {
                        freq: 'WEEKLY',
                        dtstart: result.startStr,
                        byweekday: [thu.key]
                    }
                },
                {
                    value: 5,
                    label: 'Hàng tháng vào ngày ' + thu.label + ' lần ' + app.text + ' của tháng',
                    rrule: {
                        freq: 'WEEKLY',
                        dtstart: result.startStr,
                        byweekday: [thu.key],
                        bysetpos: +app.number
                    }
                },
                {
                    value: 6,
                    label: 'Các ngày trong tuần(thứ hai đến thứ 6)',
                    rrule: {
                        freq: 'WEEKLY',
                        dtstart: result.startStr,
                        byweekday: ['MO', 'TU', 'WE', 'TH', 'FR']
                    }
                }
            ]
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
                        <Form.Check checked={allDay} onChange={handleSetAllDay} type={'checkbox'}
                                    label={'Cả ngày'}/>
                    </Form.Group>
                    <Form.Group className={'mb-2 w-full'}>
                        <Select
                            defaultValue={optionSelect[0]}
                            options={optionSelect}
                            className={'basic-single'}
                            classNamePrefix={'select'}
                            onChange={(option) => handleChangeOption(option)}
                        />
                    </Form.Group>
                </Row>
                <Form.Control type={'text'} placeholder={'vi tri'} value={location}
                              onChange={e => setLocation(e.target.value)}/>
                <Form.Group>
                    <Select
                        // defaultValue={[mailOption[0]]}
                        isMulti
                        isSearchable
                        placeholder={'chọn tài khoản đồng bộ'}
                        name="colors"
                        options={mailOption}
                        closeMenuOnSelect={false}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(option) => handleChangeMail(option)}
                    />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control hidden={accounts.length !== 1} type="email" placeholder="Thêm khách" value={inputText}
                                  onChange={handleInputChange}
                                  onKeyPress={handleKeyPress}/>
                    {
                        errMsg ? <p className={'text-red-500 mt-1'}>{errMsg}</p> : <></>
                    }
                    <ListGroup className={'mt-1'}>
                        {attendees.map((item, index) => (
                            <ListGroup.Item key={index} className="d-flex align-items-center">
                                <span>{item}</span>
                                <span className="ml-auto inline-block" onClick={() => removeItem(index)}>X</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    {/*{attendees.length ? <Form.Text>quyen khac moi</Form.Text> : null}*/}
                </Form.Group>
                <Form.Group>
                    <Form.Control as={'textarea'} row={'3'} placeholder={'Mô tả'} value={description}
                                  onChange={(e) => {
                                      setDescription(e.target.value)
                                  }}/>
                </Form.Group>

            </Form>
        )

    }

    return (
        <>
            <Modal
                show={show} onHide={handleCloseModal}
                backdropClassName={!showModal2 ? 'custom-modal' : 'modal-hide-custom'}
                // style={{display: 'flow', alignItems: 'center', justifyContent: 'center', height: '50vh'}}
                scrollable
                dialogClassName={showModal2 ? 'modal-hide-custom' : ''}
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
                    <Button variant="primary" onClick={handleSave}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModal2} onHide={() => setShowModal2(false)}
                   style={{marginTop: '20%'}}
                   dialogClassName={'!w-[400px]'}
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
