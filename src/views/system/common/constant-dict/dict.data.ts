import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '字典项名称',
    dataIndex: 'itemText',
    width: 110,
    fixed: 'left',
    align: 'center',
  },
  {
    title: '字典项值',
    align: 'center',
    fixed: 'left',
    dataIndex: 'itemValue',
    width: 90,
  },
  {
    title: '字典名称',
    dataIndex: 'dictName',

    width: 90,
    align: 'center',
  },
  {
    title: '字典编码',
    dataIndex: 'dictCode',
    align: 'center',
    width: 90,
  },
  {
    title: '排序',
    dataIndex: 'sortOrder',
    sorter: true,
    defaultSortOrder: 'descend',
    align: 'center',
    width: 70,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
  },
  {
    title: '状态',
    fixed: 'right',
    sorter: true,
    dataIndex: 'itemStatus',
    width: 90,
    slots: { customRender: 'itemStatus' },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'keyword',
    label: '名称或编码',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'itemStatus',
    label: '字典项状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '禁用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
    colProps: { span: 8 },
  },
];
export const itemFormSchema: FormSchema[] = [
  {
    field: 'itemText',
    label: '字典项名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'itemValue',
    label: '字典项值',
    component: 'Input',
    required: true,
  },
  {
    field: 'itemStatus',
    label: '字典项状态',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    required: true,
    componentProps: {
      options: [
        { label: '停用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'orderNo',
    label: '排序',
    defaultValue: 0,
    component: 'InputNumber',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
