import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
export const columns: BasicColumn[] = [
  {
    title: '流程名称',
    align: 'left',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '流程类别',
    dataIndex: 'categoryName',
    width: 100,
  },
  {
    title: '部署名称',
    align: 'left',
    dataIndex: 'deploymentName',
    width: 150,
  },
  {
    title: '当前版本',
    dataIndex: 'version',
    width: 100,
  },
  {
    title: '流程定义key',
    align: 'left',
    dataIndex: 'processDefinitionKey',
    slots: { customRender: 'processDefinitionKey' },
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'isSuspended',
    slots: { customRender: 'isSuspended' },
    width: 80,
  },
];
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '流程名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'suspensionState',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '活动', value: 1 },
        { label: '挂起', value: 2 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'startTime',
    label: '部署时间点',
    colProps: { span: 8 },
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm',
      format: 'YYYY-MM-DD HH:mm',
    },
  },
];

export const submitFormSchema: FormSchema[] = [
  {
    field: 'metaTitle',
    label: '名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'permissionStatus',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '停用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'startTime',
    label: '开始时间',
    colProps: { span: 8 },
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm',
      format: 'YYYY-MM-DD HH:mm',
    },
  },
  {
    field: 'endTime',
    label: '结束时间',
    colProps: { span: 8 },
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm',
      format: 'YYYY-MM-DD HH:mm',
    },
  },
];
