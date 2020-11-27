// import { mobileValidator } from 'el-phone-number-input'
// api 参考地址 https://greper.github.io/d2-crud-plus/guide/options.html#crudoptions
export const crudOptions = (vm) => {
  return {
    rowHandle: {
      custom: [
        {
          thin: true,
          text: null,
          type: 'warning',
          size: 'small',
          emit: 'connection',
          icon: 'el-icon-position'
        }
      ]
    },
    columns: [
      {
        title: 'id',
        key: 'id',
        form: { disabled: true }, // 表单配置
        disabled: true // 是否隐藏列
      },
      {
        title: '数据库',
        key: 'database',
        search: { disabled: false },
        showOverflowTooltip: true
      },
      {
        title: '用户名',
        key: 'username',
        showOverflowTooltip: true
      },
      {
        title: '密码',
        key: 'password',
        type: 'password',
        showOverflowTooltip: true
      },
      {
        title: '主机',
        key: 'host',
        showOverflowTooltip: true
      },
      {
        title: '端口',
        key: 'port',
        showOverflowTooltip: true
      },
      {
        title: '描述',
        key: 'description',
        type: 'text-area',
        showOverflowTooltip: true
      },
      {
        title: '创建时间',
        key: 'createdTime',
        align: 'center',
        type: 'datetime',
        form: { disabled: true }, // 表单配置
        width: 170
      }
    ]
  }
}
