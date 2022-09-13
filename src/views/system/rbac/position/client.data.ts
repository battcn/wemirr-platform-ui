import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { upload } from '/@/api/modules/storage/storageInfoFile';
import { getValidServiceInfo } from '/@/api/modules/system/manage/manageService';
export const columns: BasicColumn[] = [
  {
    title: '客户端id',
    dataIndex: 'clientId',
    fixed: 'left',
    width: 150,
  },
  {
    title: '客户端名称',
    dataIndex: 'clientName',
    fixed: 'left',
    width: 150,
  },
  {
    title: '客户端图标',
    dataIndex: 'clientIco',
    width: 120,
    slots: { customRender: 'clientIco' },
  },
  {
    title: '是否验签',
    dataIndex: 'signatureRequired',
    width: 100,
    customRender: ({ record }) => {
      return record.signatureRequired == 0 ? '不验签' : '验签';
    },
  },
  {
    title: '单设备登录',
    dataIndex: 'singleLogin',
    width: 120,
    customRender: ({ record }) => {
      return record.singleLogin == 0 ? '不是' : '是';
    },
  },
  {
    title: '内部系统',
    dataIndex: 'innerSystem',
    width: 120,
    customRender: ({ record }) => {
      return record.innerSystem == 0 ? '不是' : '是';
    },
  },
  {
    title: '限制授权错误次数',
    dataIndex: 'limitError',
    width: 150,
    customRender: ({ record }) => {
      return record.limitError == 0 ? '不限制' : '限制';
    },
  },
  {
    title: 'token的有效时长(s)',
    dataIndex: 'accessTokenValiditySeconds',
    width: 160,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 200,
  },
  {
    title: '上次授权时间',
    dataIndex: 'lastAuthTime',
    width: 180,
  },
  {
    title: '创建用户姓名',
    dataIndex: 'createUserName',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'clientStatus',
    slots: { customRender: 'clientStatus' },
    fixed: 'right',
    width: 90,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'clientId',
    label: '客户端id',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'clientName',
    label: '客户端名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'clientStatus',
    label: '状态',
    component: 'Select',
    colProps: { span: 6 },
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

export function createClientFormSchema(update) {
  const clientFormSchema: FormSchema[] = [
    {
      field: 'clientId',
      label: '客户端id',
      component: 'Input',
      required: true,
    },
    {
      field: 'clientName',
      label: '客户端名称',
      component: 'Input',
      required: true,
    },
    {
      label: '资源图标',
      field: 'clientIco',
      componentProps: {
        circled: false,
        showBtn: false,
        width: '40px',
        uploadApi: upload,
      },
      component: 'SkillfullCropperAvatar',
    },
    {
      field: 'clientSecurity',
      label: '客户端密码',
      component: 'Input',
      required: true,
      ifShow: () => !update.value,
    },
    {
      field: 'limitResource',
      label: '限制授权资源',
      defaultValue: 1,
      component: 'RadioButtonGroup',
      required: true,
      componentProps: {
        options: [
          { label: '不限制', value: 0 },
          { label: '限制', value: 1 },
        ],
      },
    },
    {
      label: '授权服务',
      required: true,
      field: 'resourceIds',
      component: 'ApiSelect',
      componentProps: {
        mode: 'multiple',
        resultField: 'serviceCode',
        labelField: 'label',
        valueField: 'serviceCode',
        api: getValidServiceInfo,
      },
      colProps: { lg: 24, md: 24 },
      ifShow: ({ values }) => values.limitResource == 1,
    },
    {
      field: 'signatureRequired',
      label: '是否验签',
      defaultValue: 0,
      component: 'RadioButtonGroup',
      required: true,
      componentProps: {
        options: [
          { label: '不验签', value: 0 },
          { label: '验签', value: 1 },
        ],
      },
    },
    {
      field: 'signatureKey',
      label: '数据签名key',
      component: 'Input',
      required: true,
      ifShow: ({ values }) => values.signatureRequired == 1,
    },
    {
      label: '允许授权类型',
      field: 'authorizedGrantTypes',
      component: 'SkillfullConstantDictSelect',
      componentProps: {
        mode: 'multiple',
        dictCode: 'system-service:AuthorizedGrantTypes',
      },
      colProps: { lg: 24, md: 24 },
    },
    {
      field: 'singleLogin',
      label: '是否单设备登录',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '不是', value: 0 },
          { label: '是', value: 1 },
        ],
      },
    },
    {
      field: 'singleLoginType',
      label: '单设备登录方式',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '一个端', value: 1 },
          { label: '不同端', value: 2 },
        ],
      },
      ifShow: ({ values }) => values.singleLogin == 1,
    },
    // {
    //   label: '允许登录端点',
    //   field: 'endpoints',
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
      field: 'innerSystem',
      label: '是否内部系统',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '不是', value: 0 },
          { label: '是', value: 1 },
        ],
      },
    },
    {
      field: 'limitError',
      label: '限制授权错误次数',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '不限制', value: 0 },
          { label: '限制', value: 1 },
        ],
      },
    },
    {
      field: 'maxErrorNum',
      label: '最大授权错误次数',
      component: 'InputNumber',
      required: true,
      ifShow: ({ values }) => values.limitError == 1,
    },
    {
      field: 'clientStatus',
      label: '状态',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '未启用', value: 0 },
          { label: '启用', value: 1 },
          { label: '锁定', value: 2 },
        ],
      },
    },

    {
      field: 'accessTokenValiditySeconds',
      label: 'token有效时长(s)',
      component: 'InputNumber',
      required: true,
    },
    {
      field: 'refreshTokenValiditySeconds',
      label: '刷新token有效时长(s)',
      component: 'InputNumber',
      required: true,
      ifShow: ({ values }) =>
        values.authorizedGrantTypes && values.authorizedGrantTypes.includes('refresh_token'),
    },
    {
      field: 'havaScoped',
      label: '是否领域',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '不是', value: 0 },
          { label: '是', value: 1 },
        ],
      },
    },
    {
      field: 'scopes',
      label: '领域',
      component: 'Input',
      required: true,
      ifShow: ({ values }) => values.havaScoped == 1,
    },
    // {
    //   label: '授权权限编码',
    //   field: 'authorityInfos',
    //   component: 'InputTextArea',
    // },
    {
      field: 'havaAutoApprove',
      label: '是否自动批准',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '不自动', value: 0 },
          { label: '自动', value: 1 },
        ],
      },
    },
    {
      field: 'codeValiditySeconds',
      label: '授权码有效时常(s)',
      component: 'InputNumber',
      required: true,
      ifShow: ({ values }) =>
        values.authorizedGrantTypes && values.authorizedGrantTypes.includes('authorization_code'),
    },
    {
      label: '授权后跳转的URI',
      field: 'webRegisteredRedirectUri',
      component: 'InputTextArea',
      colProps: { lg: 24, md: 24 },
      required: true,
      ifShow: ({ values }) =>
        values.authorizedGrantTypes && values.authorizedGrantTypes.includes('authorization_code'),
    },
    {
      field: 'additionalInformation',
      label: '扩展信息',
      component: 'InputTextArea',
      colProps: { lg: 24, md: 24 },
    },
    {
      label: '备注',
      field: 'remark',
      colProps: { lg: 24, md: 24 },
      component: 'InputTextArea',
    },
  ];
  return clientFormSchema;
}
