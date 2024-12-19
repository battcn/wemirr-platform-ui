// import { FormSchema } from "#/components/Form";

export const schemas = [
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
    show: false,
    required: true,
  },
  // {
  //   field: "code",
  //   component: "Input",
  //   label: "编号",
  //   componentProps: {
  //     placeholder: "请输入物料类型编号",
  //   },
  //   required: true,
  // },
  {
    field: 'name',
    component: 'Input',
    label: '名称',
    componentProps: {
      placeholder: '请输入物料类型名称',
    },
    required: true,
  },
  {
    field: 'status',
    component: 'RadioGroup',
    label: '是否启用',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '停用', value: '0' },
      ],
    },
    required: true,
  },
  {
    field: 'remark',
    component: 'InputTextArea',
    label: '备注',
    componentProps: {
      placeholder: '请填写描述信息',
      rows: 4,
    },
    required: true,
  },
];
