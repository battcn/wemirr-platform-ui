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
      width: 100,
      view: {
        thin: true,
        text: null,
        show: false
      },
      edit: {
        thin: true,
        text: null
        /* disabled () {
          return !vm.hasPermissions('usersphere:user:edit')
        } */
      },
      remove: {
        thin: true,
        text: null
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
        title: '编码',
        key: 'code',
        sortable: true
      },
      {
        title: '名称',
        key: 'name',
        fixed: true,
        search: { disabled: false }, // 开启查询
        disabled: false, // 是否隐藏列
        sortable: true
      },
      {
        title: '状态',
        key: 'status',
        width: '80px',
        type: 'radio',
        dict: {
          data: [
            { value: true, label: '启用' }, { value: false, label: '禁用', color: 'danger' }
          ]
        }
      },
      {
        title: '描述信息',
        key: 'description',
        form: { disabled: false }, // 表单配置
        disabled: true
      },
      {
        title: '创建时间',
        key: 'createdTime',
        width: '170px',
        fixed: true,
        type: 'datetime',
        form: { disabled: true }, // 表单配置
        sortable: true
      }
    ]
  }
}

export const crudItemOptions = (vm) => {
  return {
    viewOptions: {
      componentType: 'form' // 查看对话框字段使用行组件
    },
    options: {
      height: '100%' // 表格高度100%, 使用toolbar必须设置
    },
    pagination: {
      pageSize: 10
    },
    rowHandle: {
      width: 150,
      view: {
        thin: true,
        text: null
      },
      edit: {
        thin: true,
        text: null
        /* disabled () {
          return !vm.hasPermissions('usersphere:user:edit')
        } */
      },
      remove: {
        thin: true,
        text: null
      }
    },
    columns: [
      {
        title: 'id',
        key: 'id',
        width: 40,
        form: { disabled: true }, // 表单配置
        disabled: true // 是否隐藏列
      },
      {
        title: '名称',
        key: 'name',
        fixed: true,
        search: { disabled: false }, // 开启查询
        disabled: false, // 是否隐藏列
        sortable: true
      },
      {
        title: '编码',
        key: 'code',
        sortable: true
      },
      {
        title: '状态',
        key: 'status',
        width: '80px',
        type: 'radio',
        dict: {
          data: [
            { value: true, label: '启用' }, { value: false, label: '禁用', color: 'danger' }
          ]
        }
      },
      {
        title: '描述信息',
        key: 'description',
        form: { disabled: false }, // 表单配置
        disabled: true
      },
      {
        title: '创建时间',
        key: 'createdTime',
        width: '170px',
        fixed: true,
        type: 'datetime',
        form: { disabled: true }, // 表单配置
        sortable: true
      }
    ]
  }
}
