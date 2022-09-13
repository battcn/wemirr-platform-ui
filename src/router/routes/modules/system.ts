import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const system: AppRouteModule = {
  path: '/system',
  name: 'system',
  component: LAYOUT,
  redirect: '/system/rbac/user',
  meta: {
    orderNo: 2,
    icon: 'ant-design:setting-outlined',
    title: '系统管理',
  },
  children: [
    {
      path: 'rbac',
      name: 'SystemRbac',
      component: LAYOUT,
      meta: {
        orderNo: 1,
        title: '用户权限',
        ignoreKeepAlive: true,
      },
      children: [
        {
          path: 'user',
          name: 'UserManagement',
          meta: {
            title: '用户管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/rbac/user/index.vue'),
        },
        {
          path: 'role',
          name: 'RoleManagement',
          meta: {
            title: '角色管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/rbac/role/index.vue'),
        },
        {
          path: 'org',
          name: 'OrgManagement',
          meta: {
            title: '机构管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/rbac/org/index.vue'),
        },
        {
          path: 'position',
          name: 'PositionManagement',
          meta: {
            title: '职位管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/rbac/position/index.vue'),
        },
        {
          path: 'menu',
          name: 'MenuManagement',
          meta: {
            title: '菜单管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/rbac/menu/index.vue'),
        },
        {
          path: 'system',
          name: 'SystemManagement',
          meta: {
            title: '系统管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/rbac/system/index.vue'),
        },
        {
          path: 'client',
          name: 'ClientManagement',
          meta: {
            title: '客户端管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/rbac/client/index.vue'),
        },
      ],
    },
    {
      path: 'common',
      name: 'SystemCommon',
      component: LAYOUT,
      meta: {
        orderNo: 1,
        title: '基础公共',
        ignoreKeepAlive: true,
      },
      children: [
        {
          path: 'dict',
          name: 'DictManage',
          meta: {
            title: '字典管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/common/dict/index.vue'),
        },
        {
          path: 'constant-dict',
          name: 'ConstantDictManagement',
          meta: {
            title: '常量字典',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/common/constant-dict/index.vue'),
        },
        {
          path: 'category',
          name: 'CategoryManagement',
          meta: {
            title: '分类字典',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/common/category/index.vue'),
        },
        {
          path: 'area',
          name: 'AreaManagement',
          meta: {
            title: '区域管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/common/area/index.vue'),
        },
      ],
    },

    {
      path: 'service',
      name: 'ServiceManagement',
      meta: {
        orderNo: 1,
        title: '网关管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/manage/service/index.vue'),
    },
  ],
};

export default system;
