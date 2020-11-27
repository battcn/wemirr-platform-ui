// import { mobileValidator } from 'el-phone-number-input'
// api 参考地址 https://greper.github.io/d2-crud-plus/guide/options.html#crudoptions
export const crudOptions = (vm) => {
  return {
    viewOptions: {
      componentType: 'form' // 查看对话框字段使用行组件
    },
    pageOptions: {
      export: {
        local: true, // 本地导出，false为服务端导出
        type: 'excel'
      }
    },
    options: {
      height: '100%' // 表格高度100%, 使用toolbar必须设置
    },
    rowHandle: {
      width: 55,
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
        form: { disabled: true }, // 表单配置
        disabled: true // 是否隐藏列
      },
      {
        title: '登录账号',
        key: 'principal',
        search: { disabled: false } // 表单配置
      },
      {
        title: '名称',
        key: 'name',
        search: { disabled: false }
      },
      {
        title: 'ip',
        width: 120,
        key: 'ip'
      },
      {
        title: '登录地点',
        width: 150,
        key: 'location'
      },
      {
        title: '应用标识',
        key: 'clientId'
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
        title: '创建时间',
        key: 'createdTime',
        type: 'datetime',
        width: 170
      }
    ]
  }
}
