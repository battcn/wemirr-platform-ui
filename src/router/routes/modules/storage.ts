import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const storage: AppRouteModule = {
  path: '/storage',
  name: 'storage',
  component: LAYOUT,
  redirect: '/storage/local',
  meta: {
    orderNo: 4,
    icon: 'ant-design:database-outlined',
    title: '存储管理',
  },
  children: [
    {
      path: 'local',
      name: 'LocalManage',
      meta: {
        title: '本地存储管理',
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/storage/local/index.vue'),
    },
    {
      path: 'oss',
      name: 'OssManagement',
      meta: {
        title: 'Oss存储管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/storage/oss/index.vue'),
    },
  ],
};

export default storage;
