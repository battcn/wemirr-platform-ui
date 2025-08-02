import type { RouteRecordRaw } from 'vue-router';

const dashboard: RouteRecordRaw[] = [
  // {
  //   path: '/workflow',
  //   name: 'Workflow',
  //   component: BasicLayout,
  //   redirect: '/processDefinition',
  //   meta: {
  //     hideChildrenInMenu: true,
  //     icon: 'simple-icons:about-dot-me',
  //     title: $t('routes.dashboard.about'),
  //     orderNo: 100_000,
  //   },
  //   children: [
  //     {
  //       path: 'processDefinition',
  //       name: 'ProcessDefinition',
  //       component: () => import('#/views/workflow/processDefinition/index.vue'),
  //       meta: {
  //         title: $t('routes.dashboard.about'),
  //         icon: 'simple-icons:about-dot-me',
  //         hideMenu: true,
  //       },
  //     },
  //   ],
  // },
];

export default dashboard;
