import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from "react-toastify"
import {useEffect} from "react";
import {useRouter} from "next/router";

export default function App ({ Component, pageProps }) {
  const router = useRouter()
  useEffect(() => {
      const token = localStorage.getItem('token')
      const path = router.pathname
      console.log('path ne ', path, token)
      if(!token && (path !== '/' && path !== '/login' && path !== '/test')){
          console.log('zo day')
         router.push('/')
      } else if (token && path === '/'){
          router.push('/home')
      }
  },[])
  return <>
    <Component {...pageProps} />
    <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="colored"
    />
  </>
}
