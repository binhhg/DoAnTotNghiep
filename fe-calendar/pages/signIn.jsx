
import React, { useEffect, useState } from "react";
import {auth,provider} from "../firebaseConfig";
import {signInWithPopup} from "firebase/auth";
import Home from "./index";

function SignIn(){
    const [value,setValue] = useState({})
    const handleClick =()=>{
        signInWithPopup(auth,provider).then((data)=>{
            setValue({
                ...value,
                data
            })
            console.log('zzz',data)
        })
    }

    useEffect(()=>{
        setValue(localStorage.getItem('email'))
    })

    return (
        <div>
            {value?<Home/>:
                <button onClick={handleClick}>Signin With Google</button>
            }
        </div>
    );
}
export default SignIn;
