// import { mobileValidator } from 'el-phone-number-input'
// api 参考地址 https://greper.github.io/d2-crud-plus/guide/options.html#crudoptions
import { request } from '@/api/service'

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
        title: '组织',
        key: 'orgId',
        type: 'tree-selector',
        search: { disabled: false, component: { props: { clearable: true, multiple: false } } },
        dict: {
          url: '/authority/org/trees',
          isTree: true,
          value: 'id',
          label: 'label',
          getData: (url, dict) => {
            return request({ url: url }).then(ret => {
              return ret
            })
          }
        },
        form: {
          component: {
            span: 12,
            props: {
              clearable: true,
              multiple: false
            },
            elProps: {
              defaultExpandAll: true
            },
            dict: { cache: false }
          }
        }
      },
      {
        title: '岗位名称',
        key: 'name',
        search: { disabled: false } // 开启查询
      },
      {
        title: '状态',
        key: 'status',
        type: 'radio',
        dict: {
          data: [
            { value: true, label: '启用' }, { value: false, label: '禁用', color: 'danger' }
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
