import React from 'react'
import { signIn, signOut } from 'next-auth/react'

async function handlerSignGoogle () {
  console.log('vao day ne')
  const qq = await signIn('google')
  console.log('vcl', qq)
}

function Login () {
  return (
    <div className = " hover:divide-pink-400">
      <p>Wellcome 2</p>
      <button onClick={async () => handlerSignGoogle()}> sign in</button>
    </div>
  )
}

export default Login
