/**
 * 此处为页面中跳转固定地址(此处如果由权限去管理变更后需要更改前端代码比较麻烦)：例如：详细页面等等，
 * 因此统一固定管理，不使用动态配置页面权限
 */

import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
const fixedRouter: AppRouteModule = {
  path: '/fixed-router',
  name: 'FixedRoute',
  component: LAYOUT,
  meta: {
    orderNo: 2,
    hideChildrenInMenu: true,
    icon: 'ion:key-outline',
    title: '固定路由',
  },
  children: [
    {
      path: 'fixed-page-service-router',
      name: 'FixedPageServiceRouter',
      meta: {
        orderNo: 1,
        title: '服务路由',
        currentActiveMenu: '/system/service',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/manage/service/FixedPageServiceRouter.vue'),
    },
    {
      path: 'fixed-page-custom-filter',
      name: 'FixedPageCustomFilter',
      meta: {
        orderNo: 2,
        title: '服务过滤器',
        currentActiveMenu: '/system/service',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/manage/service/FixedPageCustomFilter.vue'),
    },
    {
      path: 'fixed-page-history-deployment',
      name: 'FixedPageHistoryDeployment',
      meta: {
        orderNo: 3,
        title: '部署历史',
        currentActiveMenu: '/process/base/design-diagram',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/process/base/diagram/FixedPageHistoryDeployment.vue'),
    },
    {
      path: 'fixed-page-model-design',
      name: 'FixedPageModelDesign',
      meta: {
        orderNo: 4,
        title: '模型设计',
        currentActiveMenu: '/process/base/design-diagram',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/process/base/diagram/FixedPageDiagramDesign.vue'),
    },
    {
      path: 'fixed-page-org-info',
      name: 'FixedPageOrgInfo',
      meta: {
        orderNo: 4,
        title: '机构管理',
        currentActiveMenu: '/system/rbac/org',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/rbac/org/FixedPageOrgInfo.vue'),
    },
    {
      path: 'fixed-page-role-info',
      name: 'FixedPageRoleInfo',
      meta: {
        orderNo: 4,
        title: '角色授权',
        currentActiveMenu: '/system/rbac/role',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/rbac/role/FixedPageRoleInfo.vue'),
    },
    {
      path: 'fixed-page-client-info',
      name: 'FixedPageClientInfo',
      meta: {
        orderNo: 4,
        title: '客户端授权',
        currentActiveMenu: '/system/rbac/client',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/rbac/client/FixedPageClientInfo.vue'),
    },
    {
      path: 'fixed-page-org-role-info',
      name: 'FixedPageOrgRoleInfo',
      meta: {
        orderNo: 4,
        title: '机构角色授权',
        currentActiveMenu: '/system/rbac/user',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/rbac/user/FixedPageOrgRoleInfo.vue'),
    },
    {
      path: 'fixed-page-user-info',
      name: 'FixedPageUserInfo',
      meta: {
        orderNo: 4,
        title: '用户信息',
        currentActiveMenu: '/system/rbac/user',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/rbac/user/FixedPageUserInfo.vue'),
    },
  ],
};
export default fixedRouter;
