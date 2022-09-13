import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const user: AppRouteModule = {
  path: '/user',
  name: 'user',
  component: LAYOUT,
  redirect: '/user/center',
  meta: {
    orderNo: 2000,
    icon: 'ant-design:user-outlined',
    title: '个人页',
  },
  children: [
    {
      path: 'center',
      name: 'Center',
      meta: {
        title: '个人中心',
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/sys/account/center/index.vue'),
    },
    {
      path: 'setting',
      name: 'Setting',
      meta: {
        title: '个人设置',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/sys/account/setting/index.vue'),
    },
  ],
};

export default user;
