import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    width: 180,
  },
  {
    title: '角色编码',
    dataIndex: 'roleCode',
    width: 200,
  },
  {
    title: '可修改',
    dataIndex: 'enableDelete',
    width: 100,
    customRender: ({ record }) => {
      return record.enableDelete == 0 ? '不能' : '能';
    },
  },
  {
    title: '状态',
    dataIndex: 'roleStatus',
    sorter: true,
    width: 110,
    slots: { customRender: 'roleStatus' },
  },
  {
    title: '创建时间',
    sorter: true,
    defaultSortOrder: 'descend',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    width: 150,
  },
  {
    title: '备注',
    align: 'left',
    width: 200,
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleNme',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'roleStatus',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '停用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'startTime',
    label: '开始时间',
    colProps: { span: 6 },
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm',
      format: 'YYYY-MM-DD HH:mm',
    },
  },
  {
    field: 'endTime',
    label: '结束时间',
    colProps: { span: 6 },
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm',
      format: 'YYYY-MM-DD HH:mm',
    },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'roleName',
    label: '角色名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'roleCode',
    label: '角色编码',
    required: true,
    component: 'Input',
  },
  {
    field: 'roleStatus',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    required: true,
    componentProps: {
      options: [
        { label: '停用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
  },
  {
    field: 'autoBind',
    label: '绑定方式',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    required: true,
    componentProps: {
      options: [
        { label: '手动授权', value: 0 },
        { label: '自动授权', value: 1 },
      ],
    },
  },
  {
    label: '备注',
    field: 'remark',
    colProps: { lg: 24, md: 24 },
    component: 'InputTextArea',
  },
];
