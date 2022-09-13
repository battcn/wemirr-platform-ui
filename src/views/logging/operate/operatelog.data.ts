import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '操作用户',
    dataIndex: 'userName',
    fixed: 'left',
    customRender: ({ record }) => {
      return record.userName || '';
    },
    width: 150,
  },
  {
    title: '数据来源',
    dataIndex: 'dataSources',
    fixed: 'left',
    width: 150,
  },
  {
    title: '日志编号',
    dataIndex: 'logCode',
    width: 180,
  },
  {
    title: '日志类型',
    dataIndex: 'logType',
    width: 180,
    customRender: ({ record }) => {
      return record.logTypeDescribe;
    },
  },
  {
    title: '请求ip',
    dataIndex: 'requestIp',
    width: 180,
  },
  {
    title: '请求方法',
    dataIndex: 'requestMethod',
    width: 100,
  },
  {
    title: '请求路径',
    dataIndex: 'requestUrl',
    width: 200,
  },
  {
    title: '请求开始时间',
    dataIndex: 'requestStartTime',
    width: 180,
    sorter: true,
    defaultSortOrder: 'descend',
  },
  {
    title: '请求结束时间',
    dataIndex: 'requestEndTime',
    width: 180,
  },
  {
    title: '请求耗时(ms)',
    dataIndex: 'costTime',
    sorter: true,
    width: 120,
  },
  {
    title: '请求状态',
    dataIndex: 'operateStatus',
    fixed: 'right',
    width: 100,
    slots: { customRender: 'operateStatus' },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'logCode',
    label: '日志编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'operateStatus',
    label: '操作状态',
    colProps: { span: 6 },
    component: 'Select',
    componentProps: {
      options: [
        { label: '失败', value: 0 },
        { label: '成功', value: 1 },
      ],
    },
  },
  {
    field: 'userName',
    label: '操作用户',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'requestIp',
    label: '请求ip',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'requestUrl',
    label: '请求路径',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'requestClientCode',
    label: '客户端编号',
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

export const detailFormSchema: FormSchema[] = [];
