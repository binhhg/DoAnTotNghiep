import React, {useEffect, useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import eventEmitter from "../utils/eventEmitter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ModalShow({data}) {
    console.log('hong ', data)
    return (
        <Form>
            <Form.Group controlId="formInput" className="mb-3">
                <Form.Control type="text" placeholder={'tieu de'} defaultValue={data?.title}
                              style={{border: 'none', borderBottom: '2px solid blue'}}/>
            </Form.Group>
        </Form>
        // <input className="mb-3" type={'text'} placeholder={'tieu de'} defaultValue={data?.title} style={{ border: 'none', borderBottom: '2px solid blue' }}/>
    )
}

export default function ModalNew({show, handel}) {
    const [data, setData] = useState({})
    const handleCloseModal = () => {
        handel(false);
    };
    const showDateTimePicker = () => {
        const filterPassedTime = (time) => {
            const currentDate = new Date();
            const selectedDate = new Date(time);

            return currentDate.getTime() < selectedDate.getTime();
        };
        if (!data.allDay) {
            return (
                <div className={'mt-5 flex items-center w-full'}>
                    <DatePicker
                        selected={data.start}
                        showTimeSelect={!data.allDay}
                        timeFormat="HH:mm"
                        dateFormat={data.allDay ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
                        showTimeInput
                        timeInputFormat={"HH:mm"}
                        minDate={data.start}
                    />
                    <DatePicker
                        selected={data.start}
                        showTimeSelect={!data.allDay}
                        timeFormat="HH:mm"
                        dateFormat={data.allDay ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
                        showTimeInput
                        timeInputFormat={"HH:mm"}
                        minDate={data.start}
                    />
                </div>
            )
        }
        return <></>
    }
    const qq = () => {
        return (
            <Form>
                <Form.Group controlId="formInput" className="mb-3">
                    <Form.Control type="text" placeholder={'tieu de'} defaultValue={data?.title}
                                  style={{border: 'none', borderBottom: '2px solid blue'}}/>
                    {showDateTimePicker()}
                </Form.Group>
            </Form>
        )
    }

    eventEmitter.on('showModalNew', result => {
        console.log('vao day dc ne')
        setData(result)
    })

    return (
        <>
            <Modal show={show} onHide={handleCloseModal}
                   style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
                <Modal.Header closeButton>
                </Modal.Header>
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
        </>
    );
}
