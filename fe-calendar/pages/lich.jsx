import React, {useRef, useState} from 'react'
import CalendarA from "../components/calendar";// a plugin!
import ModalNew from "../components/modalNew";// a plugin!
import ModalDaysiui from "../components/modalDaysiui";// a plugin!
import CalendarB from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import eventEmitter from "../utils/eventEmitter";
export default function Lich() {
    const calen = useRef(null)
    const [value, setValue] = useState(new Date());
    const [showModal, setShowModal] = useState(false);

    function handelShowModal() {
        setShowModal(true)
    }

    function onChange(vc) {
        setValue(vc)
        console.log(value)
        let calend = calen.current.getApi()
        calend.gotoDate(vc)
    }

    eventEmitter.on('clickToday', () => {
        const today = new Date();
        setValue(today)
    })
    return (
        <div className="grid grid-cols-5 h-full w-screen">
            <div className={'col-span-1 '}><CalendarB onChange={onChange} value={value}/></div>
            <div className={'col-span-4 '}>
                <CalendarA showModal={handelShowModal} ref={calen}/>
                <ModalNew show={showModal} handel={setShowModal}/>
            </div>
        </div>
    )
}
