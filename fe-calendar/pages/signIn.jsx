
import React, { useEffect, useState } from "react";
import {auth,provider} from "../firebaseConfig";
import {signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import Home from "./index";

function SignIn(){
    const [value,setValue] = useState({})
    const handleClick =()=>{
        signInWithPopup(auth,provider).then((data)=>{
            const credential = GoogleAuthProvider.credentialFromResult(data);
            const qq = data.credential
            console.log('co qq k', qq)
            const token = credential.accessToken;
            console.log('credential  ', credential)
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
