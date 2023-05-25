import React from 'react'
import { signIn, signOut } from 'next-auth/react'

async function handlerSignGoogle () {
  console.log('vao day ne')
  const qq = await signIn('google', { callbackUrl: 'http://localhost:3050' })
  console.log('vcl', qq)
}

function Login () {
  return (
    <div>
      <p>Wellocom</p>
      <button onClick={async () => handlerSignGoogle()}> sign in</button>
    </div>
  )
}

export default Login
