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
    defaultValue: 0,
    componentProps: {
      disabled: true,
      placeholder: '请填写上级ID',
    },
    // dynamicDisabled: ({ values }) => {
    //   return values.id != null;
    // },
    required: true,
  },
  {
    field: 'label',
    component: 'Input',
    label: '名称',
    componentProps: {
      placeholder: '请输入名称',
    },
    required: true,
  },
  {
    field: 'tel',
    component: 'Input',
    label: '联系方式',
    helpMessage: ['联系方式（130-0217-1000）', '部门座机（0746-8485566）'],
    componentProps: {
      placeholder: '请填写联系方式',
    },
    itemProps: {
      extra: '请填写联系方式',
    },
  },
  {
    field: 'status',
    component: 'RadioButtonGroup',
    label: '状态',
    defaultValue: true,
    componentProps: {
      placeholder: '请选择状态',
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
    },
  },
  {
    field: 'sequence',
    component: 'InputNumber',
    label: '排序',
    defaultValue: 0,
    componentProps: {
      placeholder: '请填写排序',
      min: 0,
      max: 100,
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
