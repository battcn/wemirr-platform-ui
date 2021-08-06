export interface GrowCardItem {
  icon: string;
  title: string;
  value: number;
  total: number;
  color: string;
  action: string;
}

export const growCardList: GrowCardItem[] = [
  {
    title: '用户数',
    icon: 'visit-count|svg',
    value: 2000,
    total: 120000,
    color: 'green',
    action: '日',
  },
  {
    title: '消息数',
    icon: 'total-sales|svg',
    value: 20000,
    total: 500000,
    color: 'blue',
    action: '日',
  },
  {
    title: '下载数',
    icon: 'download-count|svg',
    value: 3000,
    total: 120000,
    color: 'orange',
    action: '日',
  },
  {
    title: '订单数',
    icon: 'download-count|svg',
    value: 5000,
    total: 50000,
    color: 'orange',
    action: '日',
  },
];
