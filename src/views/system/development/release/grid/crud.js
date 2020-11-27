// import { mobileValidator } from 'el-phone-number-input'
// api 参考地址 https://greper.github.io/d2-crud-plus/guide/options.html#crudoptions
import { request } from '@/api/service'

export const crudOptions = (vm) => {
  return {
    options: {
      width: 1000
    },
    rowHandle: {
      width: 280,
      custom: [
        {
          thin: true,
          text: null,
          type: 'warning',
          size: 'small',
          emit: 'config',
          icon: 'el-icon-s-tools'
        },
        /* {
          thin: true,
          text: null,
          type: 'warning',
          size: 'small',
          emit: 'grid',
          icon: 'el-icon-s-grid'
        }, */
        {
          thin: true,
          text: null,
          type: 'warning',
          size: 'small',
          emit: 'table-view',
          icon: 'el-icon-position'
        }
      ]
    },
    columns: [
      {
        title: 'id',
        key: 'id',
        form: { disabled: true }, // 表单配置
        view: {
          disabled: true
        },
        disabled: true // 是否隐藏列
      },
      {
        title: '模块编码',
        key: 'model',
        search: { disabled: false },
        showOverflowTooltip: true
      },
      {
        title: '模板',
        key: 'templateId',
        disabled: true, // 是否隐藏列
        showOverflowTooltip: true
      },
      {
        title: '数据源',
        key: 'datasourceId',
        search: { disabled: false },
        type: 'select',
        dict: {
          url: '/tools/dynamic_release_datasource',
          value: 'id',
          label: 'database',
          getData: (url, dict) => {
            return request({ url: url }).then(ret => {
              console.log('ret', ret)
              return ret.data.records
            })
          }
        }
      },
      {
        title: '表名',
        key: 'tableName',
        showOverflowTooltip: true
      },
      {
        title: '状态',
        key: 'locked',
        type: 'radio',
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
        title: '创建时间',
        key: 'createdTime',
        align: 'center',
        type: 'datetime',
        form: { disabled: true }, // 表单配置
        view: { disabled: true }, // 表单配置
        width: 170
      },
      {
        title: '视图',
        key: 'tableView',
        disabled: true,
        form: { // 嵌套表格字段
          slot: true, // 通过form slot 引入子表格，将子表格当做一个字段组件来用
          disabled: true,
          component: {
            span: 24
          }
        }
      }
    ]
  }
}
