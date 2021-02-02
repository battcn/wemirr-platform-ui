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
      },
      edit: {
        thin: true,
        text: null
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
        disabled: true, // 是否隐藏列
        view: { disabled: true }
      },
      {
        title: '路径',
        key: 'path'
      },
      {
        title: '总数',
        key: 'total'
      },
      {
        title: '描述',
        key: 'description',
        showOverflowTooltip: true
      },
      {
        title: '是否入黑名单',
        align: 'center',
        key: 'block',
        width: 165,
        type: 'radio',
        dict: {
          data: [
            { value: true, label: '是' }, { value: false, label: '否', color: 'danger' }
          ]
        }
      },
      {
        title: '创建时间',
        key: 'createdTime',
        align: 'center',
        type: 'datetime',
        form: {
          disabled: true,
          addTemplateHandle (form) {
            form.component.show = false // 编辑时禁用控件，不允许编辑
          },
          editTemplateHandle (form) {
            form.component.disabled = false // 编辑时禁用控件，不允许编辑
          }
        }, // 表单配置
        sortable: true
      }
    ]
  }
}
