import { GrowCardItem } from './types';

export const growCardList: GrowCardItem[] = [
  {
    title: '总用户数',
    icon: '/@/assets/svg/dashboard/analysis-icon1.svg',
    price: 80000,
    up: true,
    mom: '环比增长',
    percent: 2.5,
  },
  {
    title: '今日IP',
    icon: '/@/assets/svg/dashboard/analysis-icon2.svg',
    price: 4000,
    up: true,
    mom: '同比增长',
    percent: 3,
  },
  {
    title: '今日访问',
    icon: '/@/assets/svg/dashboard/analysis-icon3.svg',
    price: 3000000,
    up: false,
    mom: '环比降低',
    percent: 2,
  },
  {
    title: '总访问量',
    icon: '/@/assets/svg/dashboard/analysis-icon4.svg',
    price: 10000,
    up: false,
    mom: '同比降低',
    percent: 1,
  },
];
