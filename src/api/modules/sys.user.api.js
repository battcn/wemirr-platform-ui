export default ({ service, request, serviceForMock, requestForMock, mock, faker, tools }) => ({
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  SYS_USER_LOGIN (data = {}) {
    // http://localhost:5002/oauth/token?username=memmsc1&password=000000&grant_type=password&scope=server&client_id=client&client_secret=client
    data.grant_type = 'password'
    data.client_id = 'client'
    data.client_secret = 'client'
    data.scope = 'server'
    data.username = 'memmsc1'
    data.password = '000000'
    // 接口请求
    return request({
      url: '/authority/oauth/token',
      method: 'post',
      params: data
    })
  }
})
