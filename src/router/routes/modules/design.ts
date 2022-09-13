import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

export const design: AppRouteModule = {
  path: '/design',
  name: 'DesignHome',
  component: LAYOUT,
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.dashboard.dashboard'),
  },
  children: [
    {
      path: 'process/workflow',
      name: 'FixedDiagramDesign',
      component: () => import('/@/views/wemirr/workflow/process/workflow.vue'),
      meta: {
        title: '流程设计',
        hideMenu: true,
      },
    },
  ],
};
export default design;
