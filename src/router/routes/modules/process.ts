import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const system: AppRouteModule = {
  path: '/process',
  name: 'process',
  component: LAYOUT,
  redirect: '/process/business',
  meta: {
    orderNo: 3,
    icon: 'ant-design:cluster-outline',
    title: '流程中心',
  },
  children: [
    {
      path: 'business',
      name: 'ProcessBusiness',
      redirect: '/process/business/process-market',
      component: LAYOUT,
      meta: {
        orderNo: 1,
        title: '审批办公',
        icon: 'ant-design:cluster-outline',
      },
      children: [
        {
          path: 'process-market',
          name: 'ProcessMarket',
          meta: {
            orderNo: 1,
            title: '流程市场',
          },
          component: () => import('/@/views/process/business/market/index.vue'),
        },
      ],
    },
    {
      path: 'base',
      name: 'ProcessBase',
      component: LAYOUT,
      redirect: '/process/base/diagram',
      meta: {
        orderNo: 2,
        title: '流程基础',
        icon: 'ant-design:highlight-outlined',
      },
      children: [
        {
          path: 'design-diagram',
          name: 'DesignDiagram',
          meta: {
            orderNo: 1,
            title: '模型设计',
          },
          component: () => import('/@/views/process/base/diagram/index.vue'),
        },
        {
          path: 'category',
          name: 'DesignCategory',
          meta: {
            orderNo: 2,
            title: '流程类别',
          },
          component: () => import('/@/views/process/base/category/index.vue'),
        },
      ],
    },
  ],
};

export default system;
