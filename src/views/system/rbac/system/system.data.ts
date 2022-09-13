import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { upload } from '/@/api/modules/storage/storageInfoFile';

export const columns: BasicColumn[] = [
  {
    title: '系统名称',
    dataIndex: 'systemName',
    width: 120,
  },
  {
    title: '系统图标',
    dataIndex: 'icon',
    width: 80,
    slots: { customRender: 'icon' },
  },
  {
    title: '系统编码',
    dataIndex: 'systemCode',
    width: 120,
  },
  {
    title: '系统描述',
    dataIndex: 'systemDescribe',
    width: 200,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 150,
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
    width: 160,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'systemName',
    label: '系统名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'systemCode',
    label: '系统编码',
    component: 'Input',
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

export const systemFormSchema: FormSchema[] = [
  {
    field: 'systemName',
    label: '系统名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'systemCode',
    label: '系统编码',
    component: 'Input',
    required: true,
  },
  {
    label: '系统图标',
    field: 'icon',
    componentProps: {
      circled: false,
      showBtn: false,
      width: '40px',
      uploadApi: upload,
    },
    component: 'SkillfullCropperAvatar',
  },
  {
    field: 'systemDescribe',
    label: '系统描述',
    colProps: { lg: 24, md: 24 },
    component: 'InputTextArea',
  },
  {
    label: '备注',
    field: 'remark',
    colProps: { lg: 24, md: 24 },
    component: 'InputTextArea',
  },
];
