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
      width: 200,
      align: 'center',
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
      },
      custom: [
        {
          thin: true,
          text: null,
          type: 'warning',
          size: 'small',
          emit: 'download',
          icon: 'el-icon-download'
        }
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
        title: '表名',
        key: 'tableName',
        search: { disabled: false },
        showOverflowTooltip: true
      },
      {
        title: '作者',
        key: 'author',
        showOverflowTooltip: true
      },
      {
        title: '包名',
        key: 'parentPackage',
        showOverflowTooltip: true
      },
      {
        title: '模块名',
        key: 'moduleName',
        showOverflowTooltip: true
      },
      {
        title: '表前缀',
        key: 'tablePrefix',
        showOverflowTooltip: true
      },
      {
        title: 'URL前缀',
        key: 'apiUrlPrefix',
        showOverflowTooltip: true
      },
      {
        title: '逻辑删除字段',
        key: 'logicDeleteField',
        showOverflowTooltip: true
      },
      {
        title: '控制器类',
        key: 'superControllerClass',
        showOverflowTooltip: true
      },
      {
        title: '平台号',
        key: 'platformId',
        showOverflowTooltip: true
      },
      {
        title: '创建时间',
        key: 'createdTime',
        align: 'center',
        type: 'datetime',
        form: { disabled: true }, // 表单配置
        width: 170
      }
    ]
  }
}
