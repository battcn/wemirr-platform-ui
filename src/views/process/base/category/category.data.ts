import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { upload } from '/@/api/modules/storage/storageInfoFile';
export const columns: BasicColumn[] = [
  {
    title: '类别名称',
    dataIndex: 'categoryName',
    width: 180,
  },
  {
    title: '类别编码',
    dataIndex: 'categoryCode',
    width: 180,
  },
  {
    title: '类别图片',
    dataIndex: 'pictures',
    slots: { customRender: 'pictures' },
    width: 100,
  },
  {
    title: '类别状态',
    dataIndex: 'categoryState',
    slots: { customRender: 'categoryState' },
    width: 100,
  },
  {
    title: '描述',
    dataIndex: 'categoryDescribe',
    width: 200,
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 150,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'categoryName',
    label: '类别名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'categoryState',
    label: '类别状态',
    colProps: { span: 6 },
    component: 'Select',
    componentProps: {
      options: [
        { label: '禁用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
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
export const categoryFormSchema: FormSchema[] = [
  {
    field: 'categoryName',
    label: '类别名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'categoryCode',
    label: '类别编码',
    component: 'Input',
    helpMessage: '唯一编码',
    required: true,
  },
  {
    field: 'categoryState',
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
    field: 'pictures',
    label: '类别图标',
    component: 'SkillfullCropperAvatar',
    componentProps: {
      circled: false,
      showBtn: false,
      width: '32px',
      uploadApi: upload,
    },
  },
  {
    label: '类别描述',
    field: 'categoryDescribe',
    component: 'InputTextArea',
    colProps: { lg: 24, md: 24 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { lg: 24, md: 24 },
  },
];
