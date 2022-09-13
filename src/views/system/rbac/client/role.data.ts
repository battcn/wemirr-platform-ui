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
    title: '状态',
    dataIndex: 'roleStatus',
    sorter: true,
    width: 110,
    slots: { customRender: 'roleStatus' },
  },
  {
    title: '备注',
    align: 'left',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleNme',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 8 },
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
    colProps: { span: 8 },
  },
];
