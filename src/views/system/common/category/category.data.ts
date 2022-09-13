import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { selectOrgTreeList } from '/@/api/modules/system/rbac/rbacOrg';

export const columns: BasicColumn[] = [
  {
    title: '分类名称',
    dataIndex: 'categoryName',
    width: 160,
    fixed: 'left',
  },
  {
    title: '分类统一编码',
    fixed: 'left',
    dataIndex: 'categoryCommonCode',
    width: 120,
  },
  {
    title: '分类编码',
    dataIndex: 'categoryCode',
    width: 60,
  },
  {
    title: '创建用户姓名',
    dataIndex: 'createUserName',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 160,
  },
  {
    title: '备注',
    width: 180,
    dataIndex: 'remark',
  },
];

const getOrgTree = () => {
  return selectOrgTreeList(0);
};
export const searchFormSchema: FormSchema[] = [
  {
    field: 'categoryName',
    label: '分类名称',
    colProps: { span: 6 },
    component: 'Input',
  },
  {
    field: 'categoryCode',
    label: '分类编码',
    colProps: { span: 6 },
    component: 'Input',
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'orgName',
    label: '组织名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'parentId',
    label: '上级组织',
    component: 'ApiTreeSelect',
    componentProps: {
      fieldNames: {
        label: 'orgName',
        value: 'orgId',
      },
      api: getOrgTree,
    },
    dynamicRules: ({ values }) => {
      return values.orgType === 2 ? [{ required: true, message: '上级组织必填' }] : [];
    },
  },
  {
    field: 'orgType',
    label: '组织类型',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    required: true,
    componentProps: {
      options: [
        { label: '公司', value: 1 },
        { label: '部门', value: 2 },
      ],
    },
  },
  {
    field: 'orgStatus',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '停用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
    required: true,
  },
  {
    field: 'orgNameEn',
    label: '英文名',
    component: 'Input',
  },

  {
    field: 'orgNameAbbr',
    label: '缩写',
    component: 'Input',
  },
  {
    field: 'orgCode',
    label: '组织编码',
    component: 'Input',
    required: true,
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
  },
  {
    field: 'fax',
    label: '传真',
    component: 'Input',
  },
  {
    field: 'orderNo',
    label: '排序',
    defaultValue: 0,
    component: 'InputNumber',
  },
  {
    field: 'address',
    label: '地址',
    component: 'InputTextArea',
    dynamicRules: ({ values }) => {
      return values.orgType === 1 ? [{ required: true, message: '组织地址必填' }] : [];
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
