import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
export const columns: BasicColumn[] = [
  {
    title: '服务名',
    dataIndex: 'serviceName',
    fixed: 'left',
    width: 150,
  },
  {
    title: '服务编码',
    dataIndex: 'serviceCode',
    fixed: 'left',
    width: 150,
  },
  {
    title: '负载均衡',
    dataIndex: 'isLoadBalancer',
    width: 90,
    customRender: ({ record }) => {
      return record.isLoadBalancer === 0 ? '否' : '是';
    },
  },
  {
    title: '订阅变化',
    dataIndex: 'subscribeChange',
    width: 90,
    customRender: ({ record }) => {
      return record.subscribeChange === 0 ? '未订阅' : '订阅';
    },
  },
  {
    title: '实例状态',
    dataIndex: 'serviceInstanceState',
    width: 180,
    slots: { customRender: 'serviceInstanceState' },
  },
  {
    title: '聚合swagger',
    dataIndex: 'enableSwagger',
    width: 120,
    customRender: ({ record }) => {
      return record.enableSwagger === 0 ? '不聚合' : '聚合';
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 160,
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    width: 130,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 160,
  },
  {
    title: '服务状态',
    dataIndex: 'serviceState',
    fixed: 'right',
    width: 90,
    slots: { customRender: 'serviceState' },
  },
];

export const columnsInstance: BasicColumn[] = [
  {
    title: 'Ip',
    dataIndex: 'ip',
    width: 140,
  },
  {
    title: '端口',
    dataIndex: 'port',
    width: 90,
  },
  {
    title: '健康状态',
    dataIndex: 'healthy',
    customRender: ({ record }) => {
      return record.healthy + '';
    },
    width: 80,
  },
  {
    title: '元数据',
    dataIndex: 'metadata',
    align: 'left',
    width: 300,
    customRender: ({ record }) => {
      let meta = '';
      if (record.metadata) {
        const metadata = record.metadata;
        for (const metaInfo in metadata) {
          meta += metaInfo + '=' + metadata[metaInfo] + '<br/>';
        }
        meta = meta.substring(0, meta.lastIndexOf('<br/>'));
      }
      return h('div', {
        innerHTML: meta,
      });
    },
  },
  {
    title: '状态',
    dataIndex: 'enabled',
    slots: { customRender: 'enabled' },
    width: 90,
  },
];
export const searchFormSchema: FormSchema[] = [
  {
    field: 'serviceName',
    label: '服务名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'serviceCode',
    label: '服务编码',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'serviceState',
    label: '服务状态',
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
export const serviceFormSchema: FormSchema[] = [
  {
    field: 'serviceName',
    label: '服务名',
    component: 'Input',
    required: true,
  },
  {
    field: 'serviceCode',
    label: '服务编码',
    component: 'Input',
    required: true,
  },
  {
    field: 'serviceState',
    label: '服务状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '禁用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
    required: true,
  },
  {
    field: 'isLoadBalancer',
    label: '网关负载均衡(LB)',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '不是', value: 0 },
        { label: '是', value: 1 },
      ],
    },
    required: true,
  },
  {
    field: 'enableSwagger',
    label: '聚合swagger',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '不聚合', value: 0 },
        { label: '聚合', value: 1 },
      ],
    },
    required: true,
  },
  {
    field: 'swaggerTag',
    label: 'Swagger名称',
    component: 'Input',
    ifShow: ({ values }) => values.isLoadBalancer === 0 && values.enableSwagger === 1,
  },
  {
    field: 'swaggerDocUri',
    label: 'SwaggerJson地址',
    component: 'InputTextArea',
    ifShow: ({ values }) => values.isLoadBalancer === 0 && values.enableSwagger === 1,
  },
  {
    field: 'subscribeChange',
    label: '是否订阅变化',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '不订阅', value: 0 },
        { label: '订阅', value: 1 },
      ],
    },
    required: true,
  },
  {
    field: 'noticeChange',
    label: '发送变化是否通知',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '不通知', value: 0 },
        { label: '通知', value: 1 },
      ],
    },
    required: true,
    ifShow: ({ values }) => values.subscribeChange === 1,
  },
  {
    field: 'noticeType',
    label: '通知类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '邮件', value: 0 },
        { label: '短信', value: 1 },
        { label: '微信消息', value: 2 },
      ],
    },
    required: true,
    ifShow: ({ values }) => values.subscribeChange === 1 && values.noticeChange === 1,
    dynamicRules: ({ values }) => {
      return values.subscribeChange === 1 && values.noticeChange === 1
        ? [{ required: true, message: '通知类型不能为空' }]
        : [];
    },
  },
  {
    field: 'noticeTemplateId',
    label: '通知模板',
    component: 'Select',
    componentProps: {
      options: [
        { label: '邮件', value: 0 },
        { label: '短信', value: 1 },
        { label: '微信消息', value: 2 },
      ],
    },
    required: true,
    ifShow: ({ values }) => values.subscribeChange === 1 && values.noticeChange === 1,
    dynamicRules: ({ values }) => {
      return values.subscribeChange === 1 && values.noticeChange === 1
        ? [{ required: true, message: '通知模板不能为空' }]
        : [];
    },
  },
  {
    field: 'headUserId',
    label: '负责人',
    component: 'Select',
    componentProps: {
      options: [
        { label: '邮件', value: 0 },
        { label: '短信', value: 1 },
        { label: '微信消息', value: 2 },
      ],
    },
    dynamicRules: ({ values }) => {
      return values.subscribeChange === 1 && values.noticeChange === 1
        ? [{ required: true, message: '负责人不能为空' }]
        : [];
    },
  },
  {
    field: 'serviceMetadataJson',
    label: '服务元数据',
    component: 'InputTextArea',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];

export function createSystemFormSchema(enableUrlType) {
  console.log('-----enableUrlType----11111---', enableUrlType.value);
  const systemFormSchema: FormSchema[] = [
    {
      field: 'urlName',
      label: '接口名称',
      component: 'Input',
      required: true,
    },
    {
      field: 'specialStatus',
      label: '状态',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '禁用', value: 0 },
          { label: '启用', value: 1 },
        ],
      },
    },
    {
      field: 'specialUrlType',
      label: '特殊url类型',
      component: 'RadioButtonGroup',
      required: true,
      componentProps: () => {
        return {
          options: [
            { label: '白名单', value: 1, disabled: enableUrlType.value == 2 },
            { label: '黑名单', value: 2, disabled: enableUrlType.value == 1 },
          ],
        };
      },
    },
    {
      label: '接口地址',
      field: 'url',
      required: true,
      component: 'InputTextArea',
    },
    {
      field: 'limitMethod',
      label: '限制请求方法',
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
      field: 'requestMethod',
      label: '允许请求方法',
      component: 'Select',
      slot: 'requestMethod',
      ifShow: ({ values }) => values.limitMethod === 1,
    },
    {
      label: '备注',
      field: 'remark',
      component: 'InputTextArea',
    },
  ];
  return systemFormSchema;
}
