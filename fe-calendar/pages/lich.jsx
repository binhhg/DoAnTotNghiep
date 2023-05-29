import React, {useRef, useState} from 'react'
import CalendarA from "../components/calendar";// a plugin!
import CalendarB from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { isSameMonth, isSameDay, startOfMonth } from 'date-fns';
import eventEmitter from "../utils/eventEmitter";

export default function Lich() {
    const calen = useRef(null)
    const [value, setValue] = useState(new Date());
    function onChange(vc) {
        setValue(vc)
        console.log(value)
        let calend = calen.current.getApi()
        calend.gotoDate(vc)
    }
    eventEmitter.on('clickToday',()=> {
        const today = new Date();
            // Nếu tháng hiện tại đã được hiển thị, chỉ cần cập nhật giá trị của Calendar về ngày hôm nay
            setValue(today)
    })
    return (
        <div className="grid grid-cols-5 h-full w-screen">
            <div className={'col-span-1 '}><CalendarB onChange={onChange} value={value}/></div>
            <div className={'col-span-4 '}>
                <CalendarA ref={calen}/>
            </div>
        </div>
    )
}
