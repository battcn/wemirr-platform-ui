import axios from 'axios'
import Adapter from 'axios-mock-adapter'
import { get } from 'lodash'
import util from '@/libs/util'
import { successLogging, errorLog, errorCreate } from './tools'

/**
 * @description 创建请求实例
 */
function createService () {
  // 创建一个 axios 实例
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    config => config,
    error => {
      // 发送失败
      console.log(error)
      return Promise.reject(error)
    }
  )
  // 响应拦截
  service.interceptors.response.use(
    response => {
      // dataAxios 是 axios 返回数据中的 data
      const dataAxios = response.data
      // 这个状态码是和后端约定的
      const { successful } = dataAxios
      // return dataAxios.data
      // 根据 code 进行判断
      successLogging(dataAxios)
      if (successful) {
        // 如果没有 code 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
        // return dataAxios.data ? dataAxios.data : dataAxios
        return dataAxios
      } else if (response.config.responseType === 'blob') {
        return dataAxios
      } else {
        // 有 code 代表这是一个后端接口 可以进行进一步的判断
        // errorCreate(`${dataAxios.message}: ${response.config.url}`)
        errorCreate(`${dataAxios.message}`)
      }
    },
    error => {
      const status = get(error, 'response.status')
      switch (status) {
        case 400:
          error.message = '请求错误'
          break
        case 401:
          error.message = '未授权，请登录'
          // 删除cookie
          util.cookies.remove('token')
          util.cookies.remove('uuid')
          // 跳转路由
          // router.push({ name: 'login' })
          // window.location.href = '/login'
          // 重定向对象不存在则返回顶层路径
          // that.$router.push({ name: 'Home' })
          // this.dispatch()
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        case 501:
          error.message = '服务未实现'
          break
        case 502:
          error.message = '网关错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网关超时'
          break
        case 505:
          error.message = 'HTTP版本不受支持'
          break
        default:
          break
      }
      if (error.message === 'Network Error') {
        error.message = '网络连接失败,请稍后再试'
      }
      errorLog(error)
      return Promise.reject(error)
    }
  )
  return service
}

function getWebSocket (wsUri) {
  return new WebSocket(wsUri)
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequestFunction (service) {
  return function (config) {
    const token = util.cookies.get('token')
    let headers = {}
    if (token !== null && token !== undefined) {
      headers = {
        Authorization: 'Bearer ' + token
      }
    }
    const configDefault = {
      headers: {
        ...headers,
        'Content-Type': get(config, 'headers.Content-Type', 'application/json')
      },
      // 超时时间 5 分钟
      timeout: 6000 * 50,
      baseURL: process.env.VUE_APP_API,
      data: {}
    }
    return service(Object.assign(configDefault, config))
  }
}

// 用于真实网络请求的实例和请求方法
export const service = createService()
export const request = createRequestFunction(service)
export const baseURL = process.env.VUE_APP_API
export const baseWsURL = process.env.VUE_APP_WS_API

// 用于模拟网络请求的实例和请求方法
export const serviceForMock = createService()
export const requestForMock = createRequestFunction(serviceForMock)

// 网络请求数据模拟工具
export const mock = new Adapter(serviceForMock)
