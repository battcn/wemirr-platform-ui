import type { AppRouteRecordRaw } from "/@/router/types";
import { t } from "/@/hooks/web/useI18n";
import {
  REDIRECT_NAME,
  LAYOUT,
  EXCEPTION_COMPONENT,
  PAGE_NOT_FOUND_NAME,
} from "/@/router/constant";
/**
 * 前端路由，不会显示到菜单
 */
export const ConstRouter: AppRouteRecordRaw[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: LAYOUT,
    redirect: "/dashboard/home",
    meta: {
      icon: "bx:bx-home",
      title: t("routes.dashboard.home"),
    },
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("/@/views/dashboard/home/index.vue"),
        meta: {
          title: t("routes.dashboard.home"),
        },
      },
    ],
  },
  {
    path: "/sys",
    name: "System",
    component: LAYOUT,
    meta: {
      title: t("layout.header.tooltipUserInfo"),
    },
    children: [
      {
        path: "account/center",
        name: "UserInfo",
        component: () => import("/@/views/sys/account-center/index.vue"),
        meta: {
          title: t("layout.header.tooltipAccountCenter"),
        },
      },
    ],
  },
];
// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: "/:path(.*)*",
  name: PAGE_NOT_FOUND_NAME,
  component: LAYOUT,
  meta: {
    title: "ErrorPage",
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: "/:path(.*)*",
      name: PAGE_NOT_FOUND_NAME,
      component: EXCEPTION_COMPONENT,
      meta: {
        title: "ErrorPage",
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
  ],
};

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: "/redirect",
  component: LAYOUT,
  name: "RedirectTo",
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: "/redirect/:path(.*)/:_redirect_type(.*)/:_origin_params(.*)",
      name: REDIRECT_NAME,
      component: () => import("/@/views/sys/redirect/index.vue"),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
      },
    },
  ],
};

export const ERROR_LOG_ROUTE: AppRouteRecordRaw = {
  path: "/error-log",
  name: "ErrorLog",
  component: LAYOUT,
  redirect: "/error-log/list",
  meta: {
    title: "ErrorLog",
    hideBreadcrumb: true,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: "list",
      name: "ErrorLogList",
      component: () => import("/@/views/sys/error-log/index.vue"),
      meta: {
        title: t("routes.basic.errorLogList"),
        hideBreadcrumb: true,
        currentActiveMenu: "/error-log",
      },
    },
  ],
};
