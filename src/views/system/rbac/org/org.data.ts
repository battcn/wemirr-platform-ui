import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { selectOrgTreeList } from '/@/api/modules/system/rbac/rbacOrg';

export const columns: BasicColumn[] = [
  {
    title: '组织名称',
    dataIndex: 'orgName',
    fixed: 'left',
    align: 'left',
    width: 180,
  },
  {
    title: '组织编码',
    fixed: 'left',
    dataIndex: 'orgCode',
    align: 'left',
    width: 150,
  },
  {
    title: '类型',
    dataIndex: 'orgType',
    fixed: 'left',
    width: 70,
    customRender: ({ record }) => {
      const orgType = record.orgType;
      const enable = orgType === 1;
      const color = enable ? 'blue' : 'green';
      const text = enable ? '公司' : '部门';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '英文名',
    dataIndex: 'orgNameEn',
    width: 180,
  },
  {
    title: '缩写',
    dataIndex: 'orgNameAbbr',
    width: 100,
  },
  {
    title: '排序',
    dataIndex: 'orgOrder',
    width: 80,
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 140,
  },
  {
    title: '传真',
    dataIndex: 'fax',
    width: 140,
  },
  {
    title: '地址',
    dataIndex: 'address',
    width: 200,
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
  {
    title: '状态',
    fixed: 'right',
    sorter: true,
    dataIndex: 'orgStatus',
    width: 90,
    slots: { customRender: 'orgStatus' },
  },
];

const getOrgTree = () => {
  return selectOrgTreeList(0);
};
export const searchFormSchema: FormSchema[] = [
  {
    field: 'orgName',
    label: '组织名称',
    colProps: { span: 6 },
    component: 'Input',
  },
  {
    field: 'orgCode',
    label: '组织编码',
    colProps: { span: 6 },
    component: 'Input',
  },
  {
    field: 'orgStatus',
    label: '状态',
    colProps: { span: 6 },
    component: 'Select',
    componentProps: {
      options: [
        { label: '停用', value: 0 },
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

export const formSchema: FormSchema[] = [
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
    field: 'orgName',
    label: '组织名称',
    component: 'Input',
    required: true,
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
    field: 'orgSimpleName',
    label: '机构简称',
    component: 'Input',
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
    field: 'socialCode',
    label: '社会信用代码',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'areaCode',
    component: 'TreeSelect',
    label: '所属区域',
    required: true,
    slot: 'areaCode',
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'scopeBusiness',
    label: '经验范围',
    component: 'InputTextArea',
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'legalPerson',
    label: '法人',
    required: true,
    component: 'Input',
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'accountsName',
    label: '开户姓名',
    component: 'Input',
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'accountsBank',
    label: '开户银行',
    component: 'Input',
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'backCard',
    label: '银行账号',
    component: 'Input',
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'businessLicensePicture',
    label: '营业执照',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'sealPicture',
    label: '印章',
    component: 'Input',
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
