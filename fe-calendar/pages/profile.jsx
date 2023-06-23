import React, {useEffect, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {faPencil} from '@fortawesome/free-solid-svg-icons'
import FieldInfo from "../components/FieldInfo";
import {useRouter} from "next/router";
import {UserApi} from "../apis/user";

const menu = [
    {
        id: 1,
        title: 'Thông tin cá nhân'
    },
    // {
    //   id: 2,
    //   title: 'Cấu hình thông báo'
    // }
]
const PersonalDetail = () => {
        const [info, setInfo] = useState({})
        const [showEdit, setShowEdit] = useState(false)
        const [account, setAccount] = useState([])

        useEffect(() => {
            (async () => {
                const res = await UserApi.getUser()
                setInfo(res)
            })()
        }, [])


        return (
            <div className={'bg-gray-200 min-h-screen'}>
                <div className={'max-w-[1200px] mx-auto lg:grid grid-cols-3 gap-x-6 lg:py-8 p-2'}>
                    <div className={'col-span-1 bg-white rounded-lg py-4 px-6'}>
                        <div className={'py-2'}>
                            <div className={'flex gap-x-3 items-center'}>
                                <div className={''}>
                                    <img src={info?.avatar} alt={''} className={'rounded-full object-top'}/>
                                </div>
                                <div
                                    className={'flex flex-col gap-y-3 justify-center w-fit items-center relative cursor-pointer font-bold'}>
                                    {info.name}
                                </div>
                            </div>
                            <div className="divider horizontal !my-2"></div>
                            <ul className={'flex flex-col py-2'}>
                                {menu.map((item, index) =>
                                    <li key={item.id}
                                        className={`p-2 cursor-pointer mb-2 ${index === 0 ? 'bg-violet-400 text-white font-bold rounded-md ' : ''}`}>{item.title}</li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className={'col-span-2 bg-white rounded-lg py-4 px-6 mt-4 lg:mt-0'}>
                        <div className={'flex gap-x-5'}>
                            <div className={'w-full'}>
                                <FieldInfo value={info?.name} icon={faPencil} label={'Tên hiển thị'} isShowEdit={showEdit}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
;

export default PersonalDetail;
