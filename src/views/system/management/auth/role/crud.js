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
      // columnHeader: '操作',
      view: {
        thin: true,
        text: null,
        show: false
      },
      edit: {
        thin: true,
        text: null
      },
      remove: {
        thin: true,
        text: null
      },
      custom: [
        // {
        //   thin: true,
        //   type: 'primary',
        //   size: 'small',
        //   emit: 'edit',
        //   icon: 'el-icon-edit'
        // },
        {
          thin: true,
          type: 'success',
          emit: 'distribution-user',
          size: 'small',
          icon: 'el-icon-user'
        },
        {
          thin: true,
          type: 'warning',
          emit: 'distribution-resource',
          size: 'small',
          icon: 'el-icon-setting'
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
        title: '名称',
        key: 'name',
        search: { disabled: false }
      },
      {
        title: '编码',
        key: 'code'
      },
      {
        title: '内置角色',
        key: 'readonly',
        type: 'radio',
        width: 80,
        align: 'center',
        form: { disabled: true },
        dict: {
          data: [
            { value: true, label: '是' }, { value: false, label: '否', color: 'danger' }
          ]
        }
      },
      {
        title: '状态',
        key: 'locked',
        type: 'radio',
        width: 60,
        align: 'center',
        dict: {
          data: [
            { value: false, label: '启用' }, { value: true, label: '禁用', color: 'danger' }
          ]
        }
      },
      {
        title: '描述',
        key: 'description',
        type: 'text-area',
        showOverflowTooltip: true
      },
      {
        title: '权限范围',
        key: 'scopeType',
        rowSlot: true,
        form: {
          slot: true,
          component: {
            span: 24
          }
        }
      },
      {
        title: '创建时间',
        key: 'createdTime',
        type: 'datetime',
        width: 170,
        form: { disabled: true }, // 表单配置
        sortable: true
      },
      {
        title: '创建人',
        key: 'createdName',
        form: { disabled: true } // 表单配置
      }
    ]
  }
}
