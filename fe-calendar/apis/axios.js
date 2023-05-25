import axios from "axios"
import ApiConfig from './config'

let token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : 'ssr'

export const api = axios.create({
    baseURL: ApiConfig.user,
    headers: {
        'x-access-token': token || 'ssr'
    }
})
