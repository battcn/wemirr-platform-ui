import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const logging: AppRouteModule = {
  path: '/logging',
  name: 'logging',
  component: LAYOUT,
  redirect: '/logging/operatelog',
  meta: {
    orderNo: 7,
    icon: 'ant-design:right-square-outlined',
    title: '日志管理',
  },
  children: [
    {
      path: 'operatelog',
      name: 'OperateLog',
      meta: {
        title: '操作日志',
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/logging/operate/index.vue'),
    },
    {
      path: 'authlog',
      name: 'AuthLog',
      meta: {
        title: '授权日志',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/logging/auth/index.vue'),
    },
  ],
};

export default logging;
