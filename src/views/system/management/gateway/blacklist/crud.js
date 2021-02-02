export const crudOptions = (vm) => {
  return {
    viewOptions: {
      componentType: 'form' // 查看对话框字段使用行组件
    },
    formOptions: {
      top: '10%',
      type: 'dialog'
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
        title: 'ip',
        key: 'ip'
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
