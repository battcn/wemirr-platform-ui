import { FormSchema } from '/@/components/Form';

export const schemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: 'ID',
    show: false,
  },
  {
    field: 'parentId',
    component: 'Input',
    label: '上级ID',
    componentProps: {
      placeholder: '请填写上级ID',
    },
    required: true,
  },
  {
    field: 'label',
    component: 'Input',
    label: '名称',
    componentProps: {
      placeholder: '请填写名称',
    },
    required: true,
  },
  {
    field: 'icon',
    component: 'IconPicker',
    label: '图标',
    componentProps: {
      placeholder: '请选择图标',
    },
  },
  {
    field: 'type',
    component: 'RadioGroup',
    label: '类型',
    itemProps: {
      extra: '如选择一键发布则需在开发平台中提前配置一键发布模板',
    },
    componentProps: {
      options: [
        {
          label: '菜单',
          value: 1,
        },
        {
          label: '一键发布',
          value: 5,
        },
      ],
    },
    required: true,
  },
  {
    field: 'path',
    component: 'Input',
    label: '路径',
    show: ({ model }) => {
      return model.type === 1;
    },
    componentProps: {
      placeholder: '请填写路径',
    },
    itemProps: {
      extra: '路径内容填写 http 地址则为外链网页',
    },
    required: true,
  },
  {
    field: 'component',
    component: 'Input',
    label: '组件',
    show: ({ model }) => {
      return model.type === 1;
    },
    componentProps: {
      placeholder: '请填写组件',
    },
    itemProps: {
      extra: '组件内容填写 http 地址则为内嵌网页',
    },
    required: false,
  },
  {
    field: 'status',
    component: 'Switch',
    label: '状态',
    componentProps: {
      placeholder: '请选择状态',
    },
  },
  {
    field: 'global',
    component: 'Switch',
    label: '是否全局',
  },
  {
    field: 'sequence',
    component: 'InputNumber',
    label: '排序',
    componentProps: {
      placeholder: '请填写排序',
    },
    itemProps: {
      extra: '数值越小优先级越高',
    },
  },
  {
    field: 'description',
    component: 'InputTextArea',
    label: '描述',
    componentProps: {
      placeholder: '请填写描述信息',
      rows: 4,
    },
    required: false,
  },
];
