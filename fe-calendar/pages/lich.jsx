import React, {useEffect, useRef, useState} from 'react'
import CalendarA from "../components/calendar";// a plugin!
import ModalNew from "../components/modalNew";// a plugin!
import ModalDaysiui from "../components/modalDaysiui";// a plugin!
import CalendarB from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import eventEmitter from "../utils/eventEmitter";
import PopoverA from "../components/popover";
import {ColorConfig} from '../apis/colorConfig'
import ColorCard from "../components/colorCard";

export default function Lich() {
    const calen = useRef(null)
    const [value, setValue] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({left: 0, top: 0});
    const [colorConfig, setColorConfig] = useState({})
    useEffect(() => {
        ( async () => {
            const qq = await ColorConfig.getColorConfig()
            console.log('qq', qq)
            setColorConfig(qq)
        })()
    }, [])
    function handelShowModal(info) {
        const {pageX, pageY} = info.jsEvent;
        console.log(pageX, pageY)
        setShowModal(true)
        // setPopoverPosition({ left: pageX, top: pageY });
    }

    function onChange(vc) {
        setValue(vc)
        let calend = calen.current.getApi()
        calend.gotoDate(vc)
    }

    eventEmitter.on('clickToday', () => {
        const today = new Date();
        setValue(today)
    })
    return (
        <div className="grid grid-cols-7 h-full w-full p-3 gap-3">
            <div className={'col-span-1'}>
                <CalendarB onChange={onChange} value={value}/>
                <ColorCard colorConfig={colorConfig} setColorConfig={setColorConfig}   />
            </div>
            <div className={'col-span-6 '}>
                <CalendarA showModal={handelShowModal} colorConfig={colorConfig} ref={calen}/>
                <ModalNew show={showModal} handle={setShowModal}/>
                {/*<PopoverA position={popoverPosition} show={showModal} handel={setShowModal} ref={calen}/>*/}
            </div>
        </div>
    )
}
