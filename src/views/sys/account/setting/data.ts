import { FormSchema } from "@/components/Form";

export interface ListItem {
  key: string;
  title: string;
  description: string;
  extra?: string;
  avatar?: string;
  color?: string;
}

// tab的list
export const settingList = [
  {
    key: "1",
    name: "基本设置",
    component: "BaseSetting",
  },
  {
    key: "2",
    name: "安全设置",
    component: "SecureSetting",
  },
  {
    key: "3",
    name: "账号绑定",
    component: "AccountBind",
  },
  {
    key: "4",
    name: "消息通知",
    component: "MsgNotify",
  },
];

// 基础设置 form
export const baseSetSchemas: FormSchema[] = [
  {
    field: "email",
    component: "Input",
    label: "邮箱",
    colProps: { span: 18 },
    required: true,
  },
  {
    field: "nickName",
    component: "Input",
    label: "昵称",
    colProps: { span: 18 },
    required: true,
  },
  {
    field: "mobile",
    component: "Input",
    label: "联系电话",
    colProps: { span: 18 },
    required: true,
  },
  {
    field: "birthday",
    component: "DatePicker",
    label: "生日",
    colProps: { span: 18 },
    helpMessage: ["方便HR给你赠送生日礼物"],
    componentProps: {
      valueFormat: "YYYY-MM-DD",
      format: "YYYY-MM-DD",
    },
  },
  {
    field: "description",
    component: "InputTextArea",
    label: "个人简介",
    colProps: { span: 18 },
    itemProps: {
      extra: "更新信息后退出重新登录才会刷新缓存数据",
    },
  },
];

// 安全设置 list
export const secureSettingList: ListItem[] = [
  {
    key: "1",
    title: "账户密码",
    description: "当前密码强度：：强",
    extra: "修改",
  },
  {
    key: "4",
    title: "备用邮箱",
    description: "已绑定邮箱：：ant***sign.com",
    extra: "修改",
  },
  {
    key: "5",
    title: "MFA 设备",
    description: "未绑定 MFA 设备，绑定后，可以进行二次确认",
    extra: "修改",
  },
];

// 账号绑定 list
export const accountBindList: ListItem[] = [
  {
    key: "1",
    title: "绑定微信",
    description: "当前未绑定微信账号",
    extra: "绑定",
    avatar: "uiw:weixin",
    color: "#1ee217",
  },
  {
    key: "2",
    title: "绑定钉钉",
    description: "当前未绑定钉钉账号",
    extra: "绑定",
    avatar: "ri:dingding-fill",
    color: "#2eabff",
  },
];

// 新消息通知 list
export const msgNotifyList: ListItem[] = [
  {
    key: "1",
    title: "账户密码",
    description: "其他用户的消息将以站内信的形式通知",
  },
  {
    key: "2",
    title: "系统消息",
    description: "系统消息将以站内信的形式通知",
  },
  {
    key: "3",
    title: "待办任务",
    description: "待办任务将以站内信的形式通知",
  },
];
