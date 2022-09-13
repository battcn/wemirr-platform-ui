import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '资源编码',
    dataIndex: 'resourceCode',
    width: 120,
    align: 'left',
    fixed: 'left',
  },
  {
    title: '接口名称',
    ellipsis: true,
    align: 'left',
    dataIndex: 'apiName',
    width: 150,
  },
  {
    title: '鉴权信息',
    sorter: true,
    align: 'left',
    dataIndex: 'permissionExpress',
    width: 180,
  },
  {
    title: '接口地址',
    dataIndex: 'apiUri',
    align: 'left',
    ellipsis: true,
    width: 220,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'apiUriAll',
    label: '接口地址',
    component: 'Input',
    colProps: { span: 12 },
  },
];
