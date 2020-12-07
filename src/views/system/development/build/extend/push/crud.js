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
      custom: [
        {
          thin: true,
          text: null,
          type: 'warning',
          size: 'small',
          emit: 'config',
          icon: 'el-icon-s-tools'
        }
        ],
      view: {
        thin: true,
        text: null
      },
      edit: {
        thin: true,
        text: null
      },
      remove: {
        thin: true,
        text: null
      },
    },
    columns: [
      {
        title: 'id',
        key: 'id',
        form: {disabled: true}, // 表单配置
        disabled: true // 是否隐藏列
      },
      {
        title: '请求方式',
        key: 'method',
        type: 'select',
        search: {disabled: false}, // 表单配置
        dict: {
          data: [
            { value: 'PUT', label: 'PUT', color: 'warning' },
            { value: 'POST', label: 'POST', color: 'danger' }
          ]
        },
        form: {
          rules: [{required: true, message: '请选择请求方式'}]
        }
      },
      {
        title: '请求地址',
        key: 'url',
        type: 'text-area',
        form: {
          rules: [{required: true, message: '请输入请求地址'}, {type: 'url',message: "请输入正确的URL"}]
        }
      },
      {
        title: '秘钥',
        key: 'secret',
        form: {
          rules: [{required: true, message: '请输入加密秘钥'}]
        }
      },
      {
        title: '状态',
        key: 'locked',
        type: 'radio',
        align: 'center',
        dict: {
          data: [
            {value: false, label: '启用'}, {value: true, label: '禁用', color: 'danger'}
          ]
        }
      },
/*      {
        title: '关联模板',
        key: 'model',
        type: 'select',
        align: 'center',
        dict: {
          data: [
            {value: 'DELETE', label: '删除', color: 'danger'},
            {value: 'INSERT', label: '添加'},
            {value: 'UPDATE', label: '修改', color: 'warning'}
          ]
        }
      },*/
      {
        title: '触发事件',
        key: 'opt',
        type: 'checkbox',
        align: 'center',
        dict: {
          data: [
            {value: 'DELETE', label: '删除', color: 'danger'},
            {value: 'INSERT', label: '添加'},
            {value: 'UPDATE', label: '修改', color: 'warning'}
          ]
        }
      },
      {
        title: '创建时间',
        key: 'createdTime',
        type: 'datetime',
        form: {
          disabled: true
        }
      }
    ]
  }
}
