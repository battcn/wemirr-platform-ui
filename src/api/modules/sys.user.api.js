export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  login (data = {}) {
    // 这四个参数是 oauth2.0 需要的
    data.grant_type = 'password'
    data.client_id = 'client'
    data.client_secret = 'client'
    data.scope = 'server'
    data.auth_type = 'vc'
    data.vc_token = data.key
    data.vc_code = data.code
    console.log('data', data)
    // data.vc_token = ''
    // data.vc_code = ''
    // 接口请求
    return request({
      url: '/authority/oauth/token',
      method: 'post',
      params: data
    })
  }
})
