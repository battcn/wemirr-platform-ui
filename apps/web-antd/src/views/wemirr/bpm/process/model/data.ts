export const NOTIFY_OPTIONS = [
  { label: '钉钉', value: 'ding-talk' },
  { label: '飞书', value: 'fei-shu' },
  { label: '企微', value: 'wechat' },
  { label: '短信', value: 'sms' },
  { label: '邮箱', value: 'email' },
];

const TASK_LISTENER_ITEM = {
  event: 'create',
  delegateExpression: '${commonMessageNotifyListener}',
};

const EXECUTION_LISTENER_ITEM = {
  event: 'start',
  delegateExpression: '${commonMessageNotifyListener}',
};
export const TASK_NOTIFY_CONTENT = {
  name: 'notifyContent',
  stringValue:
    '亲爱的 {approverName} 您好，您于 {notifyTime} 收到一条待审批的数据 {taskName} 请及时处理。',
};
export const TASK_NOTIFY_LISTENERS = {
  'ding-talk': {
    ...TASK_LISTENER_ITEM,
    fields: [
      { name: 'notifyType', stringValue: 'ding-talk' },
      TASK_NOTIFY_CONTENT,
    ],
  },
  'fei-shu': {
    ...TASK_LISTENER_ITEM,
    fields: [
      { name: 'notifyType', stringValue: 'fei-shu' },
      TASK_NOTIFY_CONTENT,
    ],
  },
  'we-chat': {
    ...TASK_LISTENER_ITEM,
    fields: [
      { name: 'notifyType', stringValue: 'we-chat' },
      TASK_NOTIFY_CONTENT,
    ],
  },
  sms: {
    ...TASK_LISTENER_ITEM,
    fields: [{ name: 'notifyType', stringValue: 'sms' }, TASK_NOTIFY_CONTENT],
  },
  email: {
    ...TASK_LISTENER_ITEM,
    fields: [{ name: 'notifyType', stringValue: 'email' }, TASK_NOTIFY_CONTENT],
  },
};

export const EXECUTION_NOTIFY_CONTENT = {
  name: 'notifyContent',
  stringValue:
    '尊敬的 {ccName}，为便于您更好关注 {taskName} 审批情况，如有任何疑问，请随时联系。谢谢！{createName}',
};
export const EXECUTION_NOTIFY_LISTENERS = {
  'ding-talk': {
    ...EXECUTION_LISTENER_ITEM,
    fields: [
      { name: 'notifyType', stringValue: 'ding-talk' },
      EXECUTION_NOTIFY_CONTENT,
    ],
  },
  'fei-shu': {
    ...EXECUTION_LISTENER_ITEM,
    fields: [
      { name: 'notifyType', stringValue: 'fei-shu' },
      EXECUTION_NOTIFY_CONTENT,
    ],
  },
  'we-chat': {
    ...EXECUTION_LISTENER_ITEM,
    fields: [
      { name: 'notifyType', stringValue: 'wechat' },
      EXECUTION_NOTIFY_CONTENT,
    ],
  },
  sms: {
    ...EXECUTION_LISTENER_ITEM,
    fields: [
      { name: 'notifyType', stringValue: 'sms' },
      EXECUTION_NOTIFY_CONTENT,
    ],
  },
  email: {
    ...EXECUTION_LISTENER_ITEM,
    fields: [
      { name: 'notifyType', stringValue: 'email' },
      EXECUTION_NOTIFY_CONTENT,
    ],
  },
};

/**
 * 多实例类型
 */
export const multiInstanceTypeOptions = [
  { label: '无', value: 'none' },
  { label: '并行', value: 'parallel' },
  { label: '串行', value: 'sequential' },
];
/**
 * 完成条件
 */
export const completionConditionOptions = [
  { label: '全部完成', value: 'all' },
  { label: '完成百分比', value: 'percentage' },
  { label: '完成数', value: 'number' },
  { label: '表达式', value: 'expression' },
];

/**
 * 条件分支选项
 */
export const comparisonOptions = [
  { label: '大于', value: '>' },
  { label: '大于等于', value: '>=' },
  { label: '小于', value: '<' },
  { label: '小于等于', value: '<=' },
  { label: '等于', value: '==' },
];
