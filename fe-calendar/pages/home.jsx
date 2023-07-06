import Image from "next/image";
import React, {Fragment, useState, useEffect} from "react";
import icon_google from "../assets/googel.svg";
import background from "../assets/img/home.png";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [number, setNumber] = useState("");
    const [flag, setFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [code, setCode] = useState("");


    // useEffect(() => {
    //   if (Object.keys(user).length > 0) router.push(`/`);
    // }, [user, router]);

    return (<div
        className={"flex items-center justify-end"}
        style={{
            backgroundImage: `url(${background.src})`,
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100vh",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
    >
        <div
            className="px-6 py-8 w-[500px] rounded-lg lg:box-shadow mx-auto lg:ml-60 !mt-60 lg:my-0 my-8">
            <div>ICalendar thuận tiện nhanh chóng, tích hợp đồng bộ với nhiều tài khoản.
            </div>
            <div className={"font-semibold text-center"}>Đăng nhập ngay</div>
            <Fragment>
                <div className="flex flex-col gap-y-1 py-2"></div>

            </Fragment>
            <div className="text-center flex flex-col gap-y-2">
                <div
                    className="flex bg-white items-center justify-center gap-x-2 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-200 border-gray-300 border-[1px]"
                    onClick={() => {
                    }}
                >
                    <Image
                        src={icon_google}
                        alt={"icon-google"}
                        width={30}
                        height={30}
                    />
                    <span>Google</span>
                </div>
            </div>
        </div>
    </div>);
}
