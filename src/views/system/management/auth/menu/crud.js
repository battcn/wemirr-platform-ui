// import { mobileValidator } from 'el-phone-number-input'
// api 参考地址 https://greper.github.io/d2-crud-plus/guide/options.html#crudoptions
export const crudOptions = (vm) => {
  return {
    viewOptions: {
      componentType: 'form' // 查看对话框字段使用行组件
    },
    options: {
      height: '480', // 表格高度100%, 使用toolbar必须设置
      border: true
    },

    rowHandle: {
      // columnHeader: '操作',
      width: 150,
      view: {
        thin: true,
        text: null
        /* show: vm.hasPermissions('usersphere:user:view') */
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
    pagination: false, // 隐藏翻页
    columns: [
      {
        title: 'id',
        key: 'id',
        form: { disabled: true }, // 表单配置
        disabled: true // 是否隐藏列
      },
      {
        title: '父ID',
        key: 'parentId',
        showOverflowTooltip: true,
        search: { disabled: false },
        disabled: true, // 是否隐藏列
        form: {
          addTemplateHandle (form) {
            form.component.disabled = true
          },
          rules: [
            { required: true, message: '请选择菜单后操作' }
          ]
        }
      },
      {
        title: '类型',
        key: 'type',
        type: 'select',
        disabled: true, // 是否隐藏列
        dict: {
          data: [
            { value: 1, label: '菜单' },
            { value: 2, label: '按钮' }
          ]
        },
        form: {
          component: {
            disabled: true,
            value: 2
          }
        }
      },
      {
        title: '名称',
        key: 'label',
        form: {
          rules: [
            { required: true, message: '请填写资源名称' }
          ]
        }
      },
      {
        title: '编码',
        key: 'permission',
        form: {
          component: {
            placeholder: 'menu:view'
          },
          rules: [
            { required: true, message: '请填写资源权限编码' }
          ],
          helper: '资源权限编码,如（user:view user:edit）'
        }
      },
      {
        title: '排序',
        key: 'sequence',
        type: 'number',
        form: {
          component: {
            value: 0,
            min: 0,
            max: 100
          }
        }
      }
    ]
  }
}
