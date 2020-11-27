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
      width: 180,
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
    columns: [
      {
        title: 'id',
        key: 'id',
        form: { disabled: true }, // 表单配置
        disabled: true // 是否隐藏列
      },
      {
        title: '账号',
        key: 'username',
        search: { disabled: false }
      },
      {
        title: '昵称',
        key: 'nickName',
        search: { disabled: false }, // 开启查询
        sortable: true
      },
      {
        title: '手机号',
        key: 'mobile',
        search: { disabled: false }, // 开启查询
        form: {
          /* { /!* validator: number, *!/ message: '手机号不正确' } */
          rules: [{ required: true, message: '请输入手机号' }]
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
        dict: {
          data: [
            { value: 1, label: '男' }, { value: 2, label: '女', color: 'danger' }
          ]
        }, // 数据字典
        search: { disabled: false }, // 开启查询
        sortable: true
      },
      {
        title: '邮箱',
        key: 'email',
        // type: 'select',
        // dict: { url: ''} //数据字典
        search: { disabled: false }, // 开启查询
        // disabled: false, // 是否隐藏列
        form: { // 表单配置
          // disabled: true, // 禁用表单编辑
          rules: [{ required: false, message: '请输入邮箱' }, { type: 'email', message: '请输入正确的邮箱' }]
        },
        sortable: true
      },
      {
        title: '头像',
        key: 'avatar',
        type: 'avatar-uploader',
        width: 100,
        sortable: true
      },
      {
        title: '内置角色',
        key: 'readonly',
        type: 'radio',
        form: { disabled: true },
        dict: {
          data: [
            { value: true, label: '是' }, { value: false, label: '否', color: 'danger' }
          ]
        }
      },
      {
        title: '创建时间',
        key: 'createdTime',
        type: 'datetime',
        form: { disabled: true }, // 表单配置
        sortable: true
      }
    ]
  }
}
