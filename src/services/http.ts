import axios, { CreateAxiosDefaults } from 'axios'
import { da } from 'date-fns/locale'

const axiosConfig: CreateAxiosDefaults = {

}

const http = axios.create(axiosConfig)

console.debug('api endpoint', process.env.REACT_APP_API)
http.defaults.baseURL = process.env.REACT_APP_API

http.defaults.headers.post['Content-Type'] = 'application/json'

http.defaults.transformResponse = [function (data: any) {
    try {
        const dateKeyRx = /date/i
        return JSON.parse(data, (key, value) => {
            return dateKeyRx.test(key) ? new Date(value) : value
        })
    } catch (error : any) {
        console.log('failed to parse to json')
        console.log('data: ' + data)
        console.log(error.message)
        return data
    }
}]

// Add a response interceptor
http.interceptors.response.use(
    function (response: any) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response.data
    }, function (error: any) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        console.error(error)
        return Promise.reject({ message: error.response?.data?.message, status: error.response?.status } as ApiError)
    })


export interface ApiError {
    message: string
    status: string
}

export function setAuthBearer(token: string) {
    if (!token?.trim()) {
        delete http.defaults.headers.common['Authorization']
    } else {
        http.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
}

export default http