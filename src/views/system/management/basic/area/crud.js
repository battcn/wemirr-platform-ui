// import { mobileValidator } from 'el-phone-number-input'
// api 参考地址 https://greper.github.io/d2-crud-plus/guide/options.html#crudoptions
import { GetChildrenList } from './api'

export const crudOptions = (vm) => {
  return {
    viewOptions: {
      componentType: 'form' // 查看对话框字段使用行组件
    },
    options: {
      height: '100%', // 表格高度100%, 使用toolbar必须设置
      rowKey: 'id',
      highlightCurrentRow: true,
      lazy: true,
      load: (tree, treeNode, resolve) => {
        GetChildrenList(tree.id).then(ret => {
          resolve(ret.data)
        })
      }
    },
    rowHandle: {
      width: 200,
      view: {
        thin: true,
        circle: true, /* 圆角图标 */
        order: 1,
        text: null
      },
      custom: [
        {
          thin: true,
          text: null,
          circle: true,
          order: 2,
          type: 'primary',
          size: 'small',
          emit: 'add',
          icon: 'el-icon-plus'
        }
      ],
      edit: {
        thin: true,
        text: null,
        circle: true,
        order: 3,
        type: 'warning'
      },
      remove: {
        thin: true,
        circle: true,
        order: 4,
        text: null
      },
      fixed: 'right'
    },
    columns: [
      {
        title: '名称',
        key: 'name',
        width: 250,
        fixed: true,
        form: {
          rules: [{ required: true, message: '请输入名称' }]
        },
        search: { disabled: false } // 开启查询
      },
      {
        key: 'id',
        title: '国标码',
        width: 120,
        align: 'center',
        form: {
          rules: [{ required: true, message: '请输入国标码' }]
        },
        treeNode: true
      },
      {
        title: '父节点名称',
        key: 'parentLabel',
        disabled: true,
        view: {
          disabled: true
        },
        form: {
          addTemplateHandle (form) {
            form.value = '中国'
            form.component.disabled = true // 编辑时禁用控件，不允许编辑
          },
          editTemplateHandle (form) {
            form.component.show = false // 编辑时禁用控件，不允许编辑
          }
        }
      },
      {
        title: '父节点',
        key: 'parentId',
        disabled: true,
        form: {
          view: {
            disabled: true
          },
          addTemplateHandle (form) {
            form.value = 0
            form.component.disabled = true // 编辑时禁用控件，不允许编辑
          },
          editTemplateHandle (form) {
            form.component.show = false // 编辑时禁用控件，不允许编辑
          }
        }
      },
      {
        title: '经度',
        key: 'longitude'
      },
      {
        title: '纬度',
        key: 'latitude'
      },
      {
        title: '排序',
        key: 'sequence',
        type: 'number'
      },
      {
        title: '级别',
        key: 'level',
        type: 'select',
        dict: {
          data: [
            { value: 1, label: '省' },
            { value: 2, label: '市', color: 'warning' },
            { value: 3, label: '区', color: 'danger' },
            { value: 4, label: '镇', color: 'danger' },
            { value: 5, label: '街道', color: 'danger' }
          ]
        }
      },
      {
        title: '来源',
        key: 'source',
        type: 'text-area',
        showOverflowTooltip: true
      },
      {
        title: '创建时间',
        key: 'createdTime',
        width: 170,
        fixed: 'right',
        type: 'datetime',
        view: {
          disabled: true
        },
        form: { disabled: true }, // 表单配置
        sortable: true
      }
    ]
  }
}
