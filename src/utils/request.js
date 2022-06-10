import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import { getToken } from './auth'
import config from '@/config'

const service = axios.create({
  baseURL: config.baseApiUrl,
  timeout: 60 * 1000
})

service.interceptors.request.use(config => {
  // TODO
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, err => {
  console.error(err)
  return Promise.reject(err)
})

service.interceptors.response.use(response => {
  const res = response.data
  return res
}, err => {
  if (err.response?.data) {
    return err.response.data
  }
  console.error(err)
  ElMessageBox.error('网络出小差，请稍后重试')
  return Promise.reject(err)
})

export default service
