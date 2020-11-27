import { request } from '@/api/service'

export const crudOptions = (vm) => {
  return {
    pagination: false, // 隐藏翻页
    rowHandle: {
      width: 120,
      lineEdit: {
        text: null,
        thin: true,
        show: true,
        validation: true // 行编辑是否启用，性能会有点影响
      }, // 行编辑触发按钮
      lineEditSave: {
        text: null,
        thin: true
      }, // 行编辑保存按钮
      lineEditCancel: {
        text: null,
        thin: true
      }, // 行编辑取消按钮
      edit: {
        show: false// 对话框编辑按钮隐藏掉
      },
      view: {
        show: false// 对话框编辑按钮隐藏掉
      },
      remove: {
        show: false// 对话框编辑按钮隐藏掉
      }
    },
    rowKey: 'key',
    columns: [{
      title: '列表配置',
      align: 'center',
      children: [
        {
          title: '物理列名',
          key: 'key',
          form: {
            editTemplateHandle (form) {
              form.component.disabled = true
            }
          }
        },
        {
          title: '字段名称',
          key: 'title'
        },
        {
          title: '组件类型',
          align: 'center',
          key: 'type',
          type: 'select',
          value: 'input',
          dict: {
            data: [
              { value: 'input', label: '单行文本' },
              { value: 'select', label: '下拉选项' },
              { value: 'radio', label: '单选按钮' }
            ]
          }
        },
        {
          title: '列表隐藏',
          key: 'disabled',
          align: 'center',
          type: 'switch',
          width: 90
        }]
    },
    {
      title: '查询配置',
      align: 'center',
      children: [
        {
          title: '关闭查询',
          align: 'center',
          width: 90,
          type: 'switch',
          key: 'search.disabled'
        },
        {
          title: '查询类型',
          key: 'search.expression',
          align: 'center',
          value: 'eq', // 默认值
          type: 'select',
          dict: {
            data: [
              { value: 'eq', label: '等于(=)' },
              { value: 'gt', label: '大于(>)' },
              { value: 'ge', label: '大于等于(>=)' },
              { value: 'lt', label: '小于等于(<)' },
              { value: 'le', label: '小于等于(<=)' },
              { value: 'like', label: '包含(like)' },
              { value: 'between', label: '之间(between)' }
              // { value: 'is_null', label: '为空(is null)' },
              // { value: 'is_not_null', label: '不为空(is not null)' }
            ]
          },
          form: {
            component: {
              name: 'dict-select',
              props: {
                clearable: true
              }
            }
          }
        }
      ]
    },
    {
      title: '表单配置',
      align: 'center',
      children: [
        {
          title: '表单隐藏',
          align: 'center',
          width: 90,
          key: 'form.disabled',
          type: 'switch'
        }
      ]
    },
    {
      title: '表单验证',
      align: 'center',
      children: [
        {
          title: '必填',
          align: 'center',
          width: 90,
          type: 'switch',
          key: 'form.rules.required'
        },
        {
          title: '验证类型',
          align: 'center',
          key: 'form.rules.type',
          type: 'select',
          dict: {
            data: [
              { value: 'email', label: '邮箱验证' },
              { value: 'mobile', label: '手机验证' }
            ]
          },
          form: {
            component: {
              name: 'dict-select',
              props: {
                clearable: true
              }
            }
          }
        }
      ]
    },
    {
      title: '字典配置',
      align: 'center',
      children: [
        {
          title: '字典编码',
          key: 'dict.code',
          type: 'select',
          dict: {
            url: '/authority/dictionaries',
            value: 'code',
            label: 'name',
            getData: (url, dict) => {
              return request({ url: url }).then(ret => {
                return ret.data.records
              })
            }
          },
          form: {
            component: {
              name: 'dict-select',
              props: {
                clearable: true
              }
            }
          }
        },
        {
          title: 'API编码',
          key: 'dict.url',
          type: 'select',
          dict: {
            data: [
              { value: 1, label: '学生' },
              { value: 2, label: '老师' }
            ]
          },
          form: {
            component: {
              name: 'dict-select',
              props: {
                clearable: true
              }
            }
          }
        }
      ]
    }
    ]
  }
}
