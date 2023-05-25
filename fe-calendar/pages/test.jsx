import React, {useEffect} from 'react'
import {useRouter} from "next/router";

export default function Test () {
  const router = useRouter()
  useEffect(() => {
    const qq = new URLSearchParams(window.location.search)
    console.log('qqqq', qq)
    const cc = qq.get('q')
    const vl = JSON.parse(cc)
    console.log('zz',vl)
    console.log(router)
  }, [])
  return <div className=" pt-4">he so lo</div>
}
