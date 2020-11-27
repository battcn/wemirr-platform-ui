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
        }],
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
        title: '模型',
        key: 'model',
        search: {disabled: false}, // 表单配置
        form: {
          rules: [{required: true, message: '请输入模型(唯一)'}]
        }
      },
      {
        title: '表名',
        key: 'tableName',
        form: {
          disabled: true
        }
      },
      {
        title: '描述',
        key: 'description',
        type: 'text-area',
        form: {
          rules: [{required: true, message: '请输入描述信息'}]
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
