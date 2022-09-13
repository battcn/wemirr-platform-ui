import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { upload } from '/@/api/modules/storage/storageInfoFile';
// import { selectOrgTreeList } from '/@/api/modules/system/rbac/rbacOrg';
import { DescItem } from '/@/components/Description/index';
import { unref, h } from 'vue';
import { Avatar } from 'ant-design-vue';
import { getAttachmentUrl } from '/@/utils';
import dayjs, { Dayjs } from 'dayjs';
const sex = ['未知', '女', '男'];
export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'userName',
    fixed: 'left',
    width: 120,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    fixed: 'left',
    width: 70,
    slots: { customRender: 'avatar' },
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
    width: 150,
  },
  {
    title: '真实姓名',
    dataIndex: 'realName',
    width: 150,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 80,
    customRender: ({ record }) => {
      return sex[record.sex] || '';
    },
  },
  {
    title: '电话号码',
    dataIndex: 'phone',
    width: 150,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 120,
  },
  {
    title: '最近登录时间',
    sorter: true,
    dataIndex: 'currentLoginTime',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 170,
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    sorter: true,
    fixed: 'right',
    slots: { customRender: 'userStatus' },
    width: 90,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'keyword',
    label: '关键信息',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'userStatus',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '正常', value: 1 },
        { label: '冻结', value: 2 },
        { label: '未激活', value: 0 },
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
export const associateColumns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'userName',
    fixed: 'left',
    width: 120,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    fixed: 'left',
    width: 70,
    slots: { customRender: 'avatar' },
  },
  {
    title: '真实姓名',
    dataIndex: 'realName',
    width: 150,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 80,
    customRender: ({ record }) => {
      return sex[record.sex] || '';
    },
  },
  {
    title: '电话号码',
    dataIndex: 'phone',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 170,
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    sorter: true,
    fixed: 'right',
    slots: { customRender: 'userStatus' },
    width: 80,
  },
];
export const associateSearchFormSchema: FormSchema[] = [
  {
    field: 'keyword',
    label: '关键信息',
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
const disabledDate = (current: Dayjs) => {
  return current && current >= dayjs().endOf('day');
};
export const accountFormSchema: FormSchema[] = [
  {
    field: 'userName',
    label: '用户名',
    component: 'Input',
    required: true,
  },
  {
    field: 'nickName',
    label: '昵称',
    component: 'Input',
    required: true,
  },
  {
    label: '真实姓名',
    field: 'realName',
    component: 'Input',
    required: true,
  },
  {
    label: '工号',
    field: 'workNo',
    component: 'Input',
  },
  // {
  //   field: 'orgId',
  //   label: '所属组织',
  //   component: 'ApiTreeSelect',
  //   componentProps: {
  //     fieldNames: {
  //       title: 'orgName',
  //       key: 'orgId',
  //       value: 'orgId',
  //     },
  //     api: selectOrgTreeList,
  //   },
  // },
  {
    field: 'userStatus',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    required: true,
    componentProps: {
      options: [
        { label: '未激活', value: 0 },
        { label: '正常', value: 1 },
        { label: '冻结', value: 2 },
      ],
    },
  },
  {
    field: 'avatar',
    label: '头像',
    component: 'SkillfullCropperAvatar',
    componentProps: {
      circled: true,
      showBtn: false,
      width: '33px',
      uploadApi: upload,
    },
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    componentProps: {
      autocomplete: 'new-password',
    },
    required: true,
  },
  {
    label: '生日',
    field: 'birthday',
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      disabledDate: disabledDate,
      showToday: false,
    },
  },
  {
    label: '性别',
    field: 'sex',
    component: 'SkillfullDictSelect',
    componentProps: {
      dictCode: 'sex',
    },
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
  },
  {
    label: '电话号码',
    field: 'phone',
    component: 'Input',
  },

  {
    label: '座机号',
    field: 'telephone',
    component: 'Input',
  },
  // {
  //   label: '职位',
  //   field: 'positionIds',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     mode: 'multiple',
  //     resultField: 'positionId',
  //     labelField: 'positionName',
  //     valueField: 'positionId',
  //     api: getAllList,
  //   },
  // },
  // {
  //   label: '角色',
  //   field: 'roleIds',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     mode: 'multiple',
  //     resultField: 'roleId',
  //     labelField: 'roleName',
  //     valueField: 'roleId',
  //     api: getEffectiveRoles,
  //   },
  // },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];

const status = {
  0: '未激活',
  1: '正常',
  2: '冻结',
};
function getPictureUrl(url: string) {
  return getAttachmentUrl(url);
}
const commonAvatarRender = (curVal, _data) => {
  return h(Avatar, {
    size: 33,
    src: getPictureUrl(curVal),
  });
};
const commonPositionRender = (curVal, _data) => {
  const posigions: string[] = [];
  if (curVal) {
    unref(curVal).forEach((item) => {
      posigions.push(item.positionName);
    });
  }
  return posigions.toString();
};
export const schemaDetail: DescItem[] = [
  {
    field: 'userName',
    label: '用户名',
  },
  {
    field: 'realName',
    label: '真实姓名',
  },
  {
    field: 'phone',
    label: '电话号码',
  },
  {
    field: 'workNo',
    label: '工号',
  },
  {
    field: 'avatar',
    label: '头像',
    render: commonAvatarRender,
  },
  {
    field: 'userStatus',
    label: '状态',
    render: (curVal, _data) => {
      return status[curVal];
    },
  },
  {
    field: 'positionInfos',
    label: '职位',
    render: commonPositionRender,
  },
  {
    label: '备注',
    field: 'remark',
  },
];
