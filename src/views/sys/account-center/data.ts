export interface ListItem {
  title: string;
  icon: string;
  color?: string;
}

export interface TabItem {
  key: string;
  name: string;
  component: string;
}

export const tags: string[] = [
  '很有想法的',
  '专注设计',
  '大长腿',
  '海纳百川',
  '全栈开发',
  'Spring Cloud',
  'Vue3',
];
export const teams: ListItem[] = [
  {
    icon: 'ri:alipay-fill',
    title: '科学搬砖组',
    color: '#ff4000',
  },
  {
    icon: 'emojione-monotone:letter-a',
    title: '中二少年团',
    color: '#7c51b8',
  },
  {
    icon: 'ri:alipay-fill',
    title: '高逼格设计',
    color: '#00adf7',
  },
  {
    icon: 'jam:codepen-circle',
    title: '程序员日常',
    color: '#00adf7',
  },
  {
    icon: 'fa:behance-square',
    title: '科学搬砖组',
    color: '#7c51b8',
  },
  {
    icon: 'jam:codepen-circle',
    title: '程序员日常',
    color: '#ff4000',
  },
];

export const details: ListItem[] = [
  {
    icon: 'ic:outline-contacts',
    title: '不愿透露姓名的帅逼',
    color: '#7c51b8',
  },
  {
    icon: 'grommet-icons:cluster',
    title: '不愿透露信息科技有限公司',
    color: '#ff4000',
  },
  {
    icon: 'bx:bx-home-circle',
    title: '上海市-徐汇区-暴富路',
    color: '#00adf7',
  },
];

export const achieveList: TabItem[] = [
  {
    key: '1',
    name: '修改密码',
    component: 'ChangePassword',
  },
  {
    key: '2',
    name: '登录日志',
    component: 'LoginLog',
  },
];

export const actions: any[] = [
  { icon: 'clarity:star-line', text: '156', color: '#018ffb' },
  { icon: 'bx:bxs-like', text: '156', color: '#459ae8' },
  { icon: 'bx:bxs-message-dots', text: '2', color: '#42d27d' },
];

export const articleList = (() => {
  const result: any[] = [];
  for (let i = 0; i < 4; i++) {
    result.push({
      ip: '192.168.0.23',
      location: '中国|0|上海|上海市|电信',
      platform: 'Mac',
      browser: 'Chrome',
      createdTime: '2020-11-14 11:20',
      icon: 'clarity:star-line',
      text: '156',
      color: '#018ffb',
    });
  }
  return result;
})();
