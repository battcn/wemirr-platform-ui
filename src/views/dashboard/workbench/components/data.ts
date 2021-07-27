interface GroupItem {
  title: string;
  icon: string;
  color: string;
  desc: string;
  date: string;
  group: string;
}

interface NavItem {
  title: string;
  icon: string;
  color: string;
}

interface DynamicInfoItem {
  avatar: string;
  name: string;
  date: string;
  desc: string;
}

export const navItems: NavItem[] = [
  {
    title: '首页',
    icon: 'ion:home-outline',
    color: '#1fdaca',
  },
  {
    title: '仪表盘',
    icon: 'ion:grid-outline',
    color: '#bf0c2c',
  },
  {
    title: '组件',
    icon: 'ion:layers-outline',
    color: '#e18525',
  },
  {
    title: '系统管理',
    icon: 'ion:settings-outline',
    color: '#3fb27f',
  },
  {
    title: '权限管理',
    icon: 'ion:key-outline',
    color: '#4daf1bc9',
  },
  {
    title: '图表',
    icon: 'ion:bar-chart-outline',
    color: '#00d8ff',
  },
];

export const dynamicInfoItems: DynamicInfoItem[] = [
  {
    avatar: 'dynamic-avatar-1|svg',
    name: 'Levin',
    date: '刚刚',
    desc: `完成全部的基础功能`,
  },
  {
    avatar: 'dynamic-avatar-2|svg',
    name: 'Levin',
    date: '一天前',
    desc: `完成RBAC模块`,
  },
  {
    avatar: 'dynamic-avatar-3|svg',
    name: 'Levin',
    date: '一周前',
    desc: `完成框架雏形`,
  },
  {
    avatar: 'dynamic-avatar-1|svg',
    name: 'Levin',
    date: '2021-07-01 18:00',
    desc: `推送了代码到 <a target="_blank" href="https://gitee.com/battcn/wemirr-platform">Github</a>`,
  },
];

export const groupItems: GroupItem[] = [
  {
    title: 'Github',
    icon: 'carbon:logo-github',
    color: '',
    desc: '源代码存放在GitHub中',
    group: '',
    date: '',
  },
  {
    title: 'Vue',
    icon: 'ion:logo-vue',
    color: '#3fb27f',
    desc: '基于 Vue3 开发',
    group: '',
    date: '',
  },
  {
    title: 'Yarn',
    icon: 'logos-yarn',
    color: '#e18525',
    desc: 'Yarn 打包',
    group: '',
    date: '',
  },
  {
    title: 'Undertow',
    icon: 'logos-undertow',
    color: '#bf0c2c',
    desc: 'Undertow 容器开发部署',
    group: '后端',
    date: '',
  },
  {
    title: 'Java',
    icon: 'cib-java',
    color: '#bf0c2c',
    desc: '采用 JDK8 进行后端开发',
    group: '后端',
    date: '',
  },
  {
    title: 'Spring',
    icon: 'logos-spring-icon',
    color: '#00d8ff',
    desc: 'Spring 全家桶',
    group: '后端',
    date: '',
  },
  {
    title: 'MySQL',
    icon: 'logos-mysql',
    color: '#4daf1bc9',
    desc: 'MySQL 数据存储',
    group: '存储',
    date: '',
  },
  {
    title: 'MongoDB',
    icon: 'cib-mongodb',
    color: '#4daf1bc9',
    desc: 'MongoDB 数据存储',
    group: '存储',
    date: '',
  },
  {
    title: 'Redis',
    icon: 'logos-redis',
    color: '#4daf1bc9',
    desc: 'Redis 缓存存储',
    group: '存储',
    date: '',
  },
];
