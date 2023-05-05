import React, { useEffect, useState } from 'react'
import { auth, provider } from '../firebaseConfig'
import { signInWithPopup, GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import Home from './index'

function SignIn () {
  const [value, setValue] = useState({})
  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      const credential = GoogleAuthProvider.credentialFromResult(data)
      const qq = data.credential
      console.log('co qq k', data)
      const token = credential.accessToken
      const idToken = credential.idToken
      const decodedIdToken = decodeURIComponent(
        atob(idToken.split('.')[1]).replace(/(.)/g, function (m, p) {
          let code = p.charCodeAt(0).toString(16).toUpperCase()
          if (code.length < 2) {
            code = '0' + code
          }
          return '%' + code
        })
      )
      const payload = JSON.parse(decodedIdToken)
      console.log('mong la co', payload)
      const authorizationCode = payload.code
      console.log('credential  ', credential)
      setValue({
        ...value,
        data
      })
      console.log('zzz', data)
    })
  }

  return (
    <div>
      <button onClick={handleClick}>Signin With Google</button>
    </div>
  )
}

export default SignIn
