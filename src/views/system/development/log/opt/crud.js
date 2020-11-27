// import { mobileValidator } from 'el-phone-number-input'
// api 参考地址 https://greper.github.io/d2-crud-plus/guide/options.html#crudoptions
export const crudOptions = (vm) => {
  return {
    viewOptions: {
      componentType: 'form' // 查看对话框字段使用行组件
    },
    options: {
      height: '100%' // 表格高度100%, 使用toolbar必须设置
    },
    rowHandle: {
      width: 55,
      fixed: 'right',
      view: {
        thin: true,
        text: null
      },
      edit: {
        thin: true,
        text: null,
        show: false
      },
      remove: {
        thin: true,
        text: null,
        show: false
      }
    },
    columns: [
      {
        title: 'id',
        key: 'id',
        disabled: true // 是否隐藏列
      },
      {
        title: 'ip',
        width: 120,
        key: 'ip'
      },
      {
        title: '登录地点',
        width: 150,
        search: { disabled: false },
        key: 'location'
      },
      {
        title: '请求方法',
        key: 'actionMethod'
      },
      {
        title: 'HTTP方式',
        key: 'httpMethod'
      },
      {
        title: '操作平台',
        key: 'platform'
      },
      {
        title: '操作系统',
        key: 'os'
      },
      {
        title: '引擎类型',
        key: 'engine'
      },
      {
        title: '引擎版本',
        key: 'engineVersion'
      },
      {
        title: '浏览器',
        key: 'browser'
      },
      {
        title: '浏览器版本',
        key: 'browserVersion'
      },
      {
        title: '操作人',
        key: 'createdName'
      },
      {
        title: '开始时间',
        key: 'startTime',
        type: 'datetime',
        width: 170
      },
      {
        title: '结束时间',
        key: 'finishTime',
        type: 'datetime',
        width: 170
      },
      {
        title: '消耗时间',
        width: 80,
        key: 'consumingTime'
      },
      {
        title: '描述信息',
        fixed: true,
        key: 'description'
      }
    ]
  }
}
