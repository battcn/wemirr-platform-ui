import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const message: AppRouteModule = {
  path: '/message',
  name: 'message',
  component: LAYOUT,
  redirect: '/message/record',
  meta: {
    orderNo: 6,
    icon: 'ant-design:bell-outlined',
    title: '消息管理',
  },
  children: [
    {
      path: 'record',
      name: 'RecordManage',
      meta: {
        title: '发送记录',
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/message/record/index.vue'),
    },
    {
      path: 'announcement',
      name: 'AnnouncementManagement',
      meta: {
        title: '通知公告',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/message/announcement/index.vue'),
    },
    {
      path: 'template',
      name: 'TemplateManagement',
      meta: {
        title: '消息模板',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/message/template/index.vue'),
    },
  ],
};

export default message;
