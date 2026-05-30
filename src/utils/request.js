import axios from 'axios'
import router from '@/router'

// 生产环境通过 VUE_APP_API_URL 环境变量指定后端地址，开发环境使用 vue.config.js 代理
const baseURL = process.env.VUE_APP_API_URL || ''

const request = axios.create({
  baseURL,
  timeout: 10000
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data && (data.code === 401 || data.code === 403)) {
      localStorage.removeItem('jwt')
      localStorage.removeItem('userID')
      localStorage.removeItem('avatar')
      localStorage.removeItem('role')
      if (router.currentRoute.path !== '/') {
        router.replace('/')
      }
    }
    return response
  },
  (error) => {
    const status = error && error.response && error.response.status
    if (status === 401 || status === 403) {
      localStorage.removeItem('jwt')
      localStorage.removeItem('userID')
      localStorage.removeItem('avatar')
      localStorage.removeItem('role')
      if (router.currentRoute.path !== '/') {
        router.replace('/')
      }
    }
    return Promise.reject(error)
  }
)

export default request
