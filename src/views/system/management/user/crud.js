// import { mobileValidator } from 'el-phone-number-input'
// api 参考地址 https://greper.github.io/d2-crud-plus/guide/options.html#crudoptions
import { request } from '@/api/service'

export const crudOptions = (vm) => {
  return {
    viewOptions: {
      componentType: 'form' // 查看对话框字段使用行组件
    },
    formOptions: {
      top: '2%'
    },
    options: {
      height: '100%' // 表格高度100%, 使用toolbar必须设置
    },
    rowHandle: {
      width: 180,
      view: {
        thin: true,
        text: null
        /* show: vm.hasPermissions('usersphere:user:view') */
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
        /*        {
          thin: true,
          text: null,
          type: 'warning',
          size: 'small',
          emit: 'authz',
          icon: 'el-icon-s-flag',
          disabled () {
            return !vm.hasPermissions('usersphere:user:authz')
          }
        } */
      ]
    },
    expandRow: true,
    columns: [
      {
        title: 'id',
        key: 'id',
        form: { disabled: true }, // 表单配置
        disabled: true, // 是否隐藏列
        view: { disabled: true }
      },
      {
        title: '账号',
        key: 'username',
        showOverflowTooltip: true,
        search: { disabled: false },
        form: {
          editTemplateHandle (form) {
            form.component.disabled = true // 编辑时禁用控件，不允许编辑
          },
          rules: [
            { required: true, message: '请输入账号' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符' }
          ]
        }
      },
      {
        title: '密码',
        key: 'password',
        disabled: true, // 是否隐藏列
        view: {
          disabled: true
        },
        form: {
          editTemplateHandle (form) {
            form.component.show = false // 编辑时禁用控件，不允许编辑
          },
          rules: [
            { required: true, message: '请输入密码' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符' }
          ]
        }
      },
      {
        title: '昵称',
        key: 'nickName',
        showOverflowTooltip: true,
        search: { disabled: false }, // 开启查询
        form: {
          rules: [
            { required: true, message: '请输入昵称' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符' }
          ]
        },
        sortable: true
      },
      {
        title: '手机号',
        key: 'mobile',
        search: { disabled: false }, // 开启查询
        width: 120,
        form: {
          rules: [
            { required: true, message: '请输入手机号' },
            { min: 11, max: 11, message: '长度在 11 个字符' }
          ]
        },
        valueBuilder (row) { // 将row里面手机号相关的字段组合成组件需要的value对象
          row.mobileValue = { phoneNumber: row.mobile, callingCode: row.callingCode }
        },
        valueResolve (row) { // 将value解析成row的字段
          if (row.mobileValue != null) {
            row.mobile = row.mobileValue.phoneNumber
            row.callingCode = row.mobileValue.callingCode
          }
        },
        disabled: false, // 是否隐藏列
        sortable: true
      },
      {
        title: '性别',
        key: 'sex',
        type: 'radio',
        width: 80,
        form: {
          component: {
            value: 1
          }
        },
        dict: {
          data: [
            { value: 1, label: '男' }, { value: 2, label: '女', color: 'danger' }
          ]
        }, // 数据字典
        search: { disabled: false } // 开启查询
      },
      {
        title: '邮箱',
        key: 'email',
        width: 100,
        showOverflowTooltip: true,
        search: { disabled: false }, // 开启查询
        form: { // 表单配置
          rules: [
            { type: 'email', message: '请输入正确的邮箱' }
          ]
        },
        sortable: true
      },
      {
        title: '头像',
        key: 'avatar',
        type: 'avatar-uploader',
        width: 70
      },
      {
        title: '组织',
        key: 'orgId',
        search: { disabled: true }, // 开启查询
        type: 'tree-selector',
        dict: {
          url: '/authority/org/trees',
          isTree: true,
          value: 'id',
          label: 'label',
          getData: (url, dict) => {
            return request({ url: url }).then(ret => {
              return ret.data
            })
          }
        },
        form: {
          component: {
            props: { multiple: false },
            elProps: {
              defaultExpandAll: true
            },
            on: {
              click () {

              }
            }
          },
          valueChange (key, value, form, { getColumn, mode, component, immediate, getComponent }) {
            form.stationId = null
            if (value) {
              getComponent('stationId').reloadDict() // 执行 stationId 的select组件的reloadDict()方法，触发“stationId”重新加载字典
            }
          },
          valueChangeImmediate: false // 是否在编辑框打开后立即触发一次valueChange方法
        }
      },
      {
        title: '岗位',
        key: 'stationId',
        type: 'select',
        dict: {
          url (dict, { form /* 当前的form表单 */, component /* 当前的组件ref */ }) {
            if (form && form.orgId != null) { // 本数据字典的url是通过前一个select的选项决定的
              return 'authority/stations?orgId=' + form.orgId
            }
            return undefined // 返回undefined 将不加载字典
          },
          value: 'id',
          label: 'name',
          immediate: true,
          valueChangeImmediate: false, // 是否在编辑框打开后立即触发一次valueChange方法
          getData: (url, dict) => {
            return request({ url: url }).then(ret => {
              return ret.data.records
            })
          },
          onReady (data, dict, { form, component }) {
            if (component.value == null && data !== null && data.length > 0) {
              component.onInput(data[0].id)
            }
          }
        }
      },
      {
        title: '职位状态',
        key: 'positionStatus',
        type: 'select',
        dict: {
          data: [
            { value: 'WORKING', label: '在职' },
            { value: 'QUIT', label: '离职', color: 'danger' },
            { value: 'LEAVE', label: '请假', color: 'warning' }
          ]
        }
      },
      {
        title: '民族',
        key: 'nation',
        type: 'select',
        dict: {
          url: '/authority/dictionaries/NATION/list',
          value: 'code',
          label: 'name',
          getData: (url, dict) => {
            return request({ url: url }).then(ret => {
              return ret
            })
          }
        }
      },
      {
        title: '学历',
        key: 'education',
        type: 'select',
        dict: {
          url: '/authority/dictionaries/EDUCATION/list',
          value: 'code',
          label: 'name',
          getData: (url, dict) => {
            return request({ url: url }).then(ret => {
              return ret
            })
          }
        }
      },
      {
        title: '创建时间',
        key: 'createdTime',
        width: 165,
        type: 'datetime',
        form: {
          disabled: true
          // addTemplateHandle (form) {
          //   form.component.show = false // 编辑时禁用控件，不允许编辑
          // },
          // editTemplateHandle (form) {
          //   form.component.disabled = false // 编辑时禁用控件，不允许编辑
          // }
        }, // 表单配置
        sortable: true
      }
    ],
    formGroup: {
      type: 'collapse', // tab
      accordion: false,
      groups: {
        user: {
          title: '基础信息',
          icon: 'el-icon-price-tag',
          columns: ['username', 'password']
        },
        base: {
          title: '基础信息',
          icon: 'el-icon-price-tag',
          columns: ['nickName', 'mobile', 'email', 'sex']
        },
        auth: {
          title: '职责',
          collapsed: false,
          icon: 'el-icon-warning-outline',
          columns: ['orgId', 'stationId', 'positionStatus', 'org']
        },
        info: {
          title: '详情',
          collapsed: false,
          icon: 'el-icon-warning-outline',
          columns: ['nation', 'education', 'stationName', 'positionStatus', 'avatar', 'readonly', 'createdTime']
        }
      }
    }
  }
}
