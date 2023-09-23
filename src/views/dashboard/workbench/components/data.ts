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
    title: "首页",
    icon: "ion:home-outline",
    color: "#1fdaca",
  },
  {
    title: "仪表盘",
    icon: "ion:grid-outline",
    color: "#bf0c2c",
  },
  {
    title: "组件",
    icon: "ion:layers-outline",
    color: "#e18525",
  },
  {
    title: "系统管理",
    icon: "ion:settings-outline",
    color: "#3fb27f",
  },
  {
    title: "权限管理",
    icon: "ion:key-outline",
    color: "#4daf1bc9",
  },
  {
    title: "图表",
    icon: "ion:bar-chart-outline",
    color: "#00d8ff",
  },
];

export const dynamicInfoItems: DynamicInfoItem[] = [
  {
    avatar: "dynamic-avatar-2|svg",
    name: "Levin",
    date: "2023-09",
    desc: `开源了基于 Spring Cloud + JDK17 <a>wemirr-platform</a> 项目 `,
  },
  {
    avatar: "dynamic-avatar-3|svg",
    name: "Levin",
    date: "2019-08",
    desc: `开源了基于 Spring Cloud + JDK8 <a>wemirr-platform</a> 项目 `,
  },
  {
    avatar: "dynamic-avatar-4|svg",
    name: "Levin",
    date: "2018-07",
    desc: `开源了基于 Spring Boot <a>battcn-plus</a> 项目 `,
  },
  {
    avatar: "dynamic-avatar-6|svg",
    name: "Levin",
    date: "2017-06",
    desc: `开源了基于 ssm <a>battcn2.0</a> 项目 `,
  },
  {
    avatar: "dynamic-avatar-6|svg",
    name: "Levin",
    date: "2016-05",
    desc: `开源了基于 ssm <a>battcn1.0</a> 项目 `,
  },
];

export const groupItems: GroupItem[] = [
  {
    title: "安全",
    icon: "mdi:encryption-secure-outline",
    color: "#00d8ff",
    desc: "基于Spring实现当下最新OAuth2.1认证授权权限管理体系",
    group: "免费",
    date: "2021-09-23",
  },
  {
    title: "租户",
    icon: "arcticons:company-portal",
    color: "#3fb27f",
    desc: "支持字段、数据源等多种策略隔离方式实现多租户,全部开源,无需付费解锁",
    group: "免费",
    date: "2023-09-23",
  },
  {
    title: "存储",
    icon: "grommet-icons:storage",
    color: "#e18525",
    desc: "支持主流的OSS的云文件存储,支持客户端直接调用或内部API调用",
    group: "免费",
    date: "2023-09-23",
  },
  {
    title: "BPM",
    icon: "flat-color-icons:workflow",
    color: "#bf0c2c",
    desc: "基于最新的 Camunda7 + 自定义表单、支持多租户的工作流引擎",
    group: "付费",
    date: "2023-09-23",
  },
  {
    title: "TMS",
    icon: "arcticons:tmshappinest",
    color: "#00d8ff",
    desc: "提供常用的TMS服务,拿来即用或基于TMS模块二次开发",
    group: "付费",
    date: "2023-09-23",
  },
  {
    title: "WMS",
    icon: "gis:wms",
    color: "#EBD94E",
    desc: "提供常用的WMS服务,拿来即用或基于WMS模块二次开发",
    group: "付费",
    date: "2023-09-23",
  },
];
