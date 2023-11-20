import type { AppRouteModule } from "@/router/types";
// import { t } from "@/hooks/web/useI18n";

import { LAYOUT } from "@/router/constant";

const account: AppRouteModule = {
  path: "/account",
  name: "Account",
  component: LAYOUT,
  redirect: "/dashboard/analysis",
  meta: {
    orderNo: 10,
    title: "账户管理",
  },
  children: [
    {
      path: "setting",
      name: "AccountSetting",
      component: () => import("@/views/sys/account/setting/index.vue"),
      meta: {
        title: "个人设置",
        hideMenu: true,
      },
    },
  ],
};

export default account;
