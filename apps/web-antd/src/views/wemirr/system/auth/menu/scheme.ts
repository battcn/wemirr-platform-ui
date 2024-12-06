import { useVbenForm } from '#/adapter/form';

export function menuForm(handleSubmit: any) {
  return useVbenForm({
    // 所有表单项共用，可单独在表单内覆盖
    commonConfig: {
      // 所有表单项
      componentProps: {
        class: 'w-full',
      },
    },
    // 提交函数
    handleSubmit,
    layout: 'horizontal',
    schema: [
      {
        fieldName: 'id',
        component: 'Input',
        label: 'ID',
        dependencies: {
          show: false,
          triggerFields: ['id'],
        },
      },
      {
        fieldName: 'parentId',
        component: 'Input',
        label: '上级ID',
        defaultValue: 0,
        dependencies: {
          show: false,
          triggerFields: ['id'],
        },
        componentProps: {
          disabled: true,
          placeholder: '请填写上级ID',
        },
        rules: 'required',
      },
      {
        fieldName: 'type',
        component: 'RadioGroup',
        label: '分类',
        dependencies: {
          trigger(values, formApi) {
            if (values?.id === undefined) {
              if (values.type === 'directory') {
                formApi.setValues({ component: 'BasicLayout' });
              } else {
                formApi.setValues({ component: '' });
              }
            }
          },
          triggerFields: ['type'],
        },
        componentProps: {
          options: [
            { label: '目录', value: 'directory' },
            { label: '菜单', value: 'menu' },
            { label: '外链', value: 'link' },
            { label: '内嵌', value: 'iframe' },
          ],
        },
        rules: 'required',
      },
      {
        fieldName: 'path',
        component: 'Input',
        label: '路径',
        componentProps: {
          placeholder: '请填写路径',
          extra: '路径内容填写 http 地址则为外链网页',
        },
        rules: 'required',
      },
      {
        fieldName: 'component',
        component: 'Input',
        label: '组件',
        help: '分类为 [菜单] 则为页面路由地址 ,  [内嵌/外链] 则打开网页',
        componentProps: {
          placeholder: '请填写组件',
        },
        dependencies: {
          disabled(values) {
            return values.type === 'directory';
          },
          triggerFields: ['type'],
        },
      },
      {
        fieldName: 'title',
        component: 'Input',
        label: '标题',
        componentProps: {
          placeholder: '请输入路由标题',
        },
        rules: 'required',
      },
      {
        fieldName: 'permission',
        component: 'Input',
        label: '编码',
        componentProps: {
          placeholder: '请输入路由权限码',
        },
      },
      {
        fieldName: 'icon',
        component: 'Input',
        label: '图标',
        rules: 'required',
      },
      {
        fieldName: 'status',
        component: 'RadioGroup',
        label: '状态',
        defaultValue: true,
        componentProps: {
          options: [
            { label: '启用', value: true },
            { label: '禁用', value: false },
          ],
        },
      },
      {
        label: '可见',
        fieldName: 'visible',
        component: 'RadioGroup',
        help: '菜单是否可见,隐藏的话则可以正常路由跳转,但是菜单栏不会显示',
        defaultValue: true,
        componentProps: {
          options: [
            { label: '显示', value: true },
            { label: '隐藏', value: false },
          ],
        },
      },
      {
        fieldName: 'keepAlive',
        component: 'RadioGroup',
        label: '缓存',
        help: '开启后页面会缓存，不会重新加载，仅在标签页启用时有效',
        defaultValue: true,
        componentProps: {
          options: [
            { label: '是', value: true },
            { label: '否', value: false },
          ],
        },
      },
      {
        fieldName: 'sequence',
        component: 'InputNumber',
        label: '排序',
        defaultValue: 0,
        componentProps: {
          placeholder: '请填写排序',
          help: '数值越小优先级越高',
          min: 0,
          max: 100,
        },
      },
      {
        fieldName: 'description',
        component: 'Textarea',
        label: '描述',
        componentProps: {
          placeholder: '请填写描述信息',
          rows: 4,
        },
      },
    ],
  });
}
