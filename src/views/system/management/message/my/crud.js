// import { mobileValidator } from 'el-phone-number-input'
// api 参考地址 https://greper.github.io/d2-crud-plus/guide/options.html#crudoptions
import { request } from '@/api/service'
// import api  from '@/api'

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
        text: null
        /* show: vm.hasPermissions('usersphere:user:view') */
      },
      edit: {
        thin: true,
        text: null,
        show: false
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
        view: { disabled: true }, // 表单配置
        disabled: true // 是否隐藏列
      },
      {
        title: '标题',
        key: 'title',
        search: { disabled: false } // 开启查询
      },
      {
        title: '类型',
        key: 'code',
        type: 'select',
        search: { disabled: false }, // 开启查询
        dict: {
          url: '/authority/dictionaries/NOTICE/list',
          value: 'code',
          label: 'name',
          getData: (url, dict) => {
            return request({ url: url }).then(ret => {
              return ret.data
            })
          }
        }
      },
      {
        title: '状态',
        key: 'mark',
        form: { disabled: true }, // 表单配置
        type: 'radio',
        dict: {
          data: [
            { value: true, label: '已读' }, { value: false, label: '未读', color: 'danger' }
          ]
        }
      },
      {
        title: '描述',
        key: 'description',
        type: 'text-area'
      },
      {
        title: '创建时间',
        key: 'createdTime',
        type: 'datetime',
        form: { disabled: true } // 表单配置
      }
    ]
  }
}
