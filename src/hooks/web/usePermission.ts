/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RouteRecordRaw } from 'vue-router';

import { useAppStore } from '/@/store/modules/app';
import { usePermissionStore } from '/@/store/modules/permission';
import { useUserStore } from '/@/store/modules/user';

import { useTabs } from './useTabs';

import { router, resetRouter } from '/@/router';
// import { RootRoute } from '/@/router/routes';

import projectSetting from '/@/settings/projectSetting';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { RoleEnum } from '/@/enums/roleEnum';

import { isArray } from '/@/utils/is';
import { useMultipleTabStore } from '/@/store/modules/multipleTab';

// User permissions related operations
export function usePermission() {
  const userStore = useUserStore();
  const appStore = useAppStore();
  const permissionStore = usePermissionStore();
  const { closeAll } = useTabs(router);

  /**
   * Change permission mode
   */
  async function togglePermissionMode() {
    appStore.setProjectConfig({
      permissionMode:
        projectSetting.permissionMode === PermissionModeEnum.BACK
          ? PermissionModeEnum.ROUTE_MAPPING
          : PermissionModeEnum.BACK,
    });
    location.reload();
  }

  /**
   * Reset and regain authority resource information
   * @param id
   */
  async function resume() {
    const tabStore = useMultipleTabStore();
    tabStore.clearCacheTabs();
    resetRouter();
    const routes = await permissionStore.buildRoutesAction();
    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });
    permissionStore.setLastBuildMenuTime();
    closeAll();
  }

  /**
   * Determine whether there is permission
   */
  function hasPermission(value?: string, def = true): boolean {
    if (!value) {
      return def;
    }
    // 如果是超级管理员则拥有所有权限直接放行
    const userInfo = userStore.getUserInfo;
    if (userInfo.superAdmin) {
      return true;
    }
    const allCodeList = (router.currentRoute.value?.meta?.actionSet || []) as string[];
    if (allCodeList.length <= 0) {
      return false;
    }
    return allCodeList.includes(value);
  }

  /**
   * Change roles
   * @param roles
   */
  async function changeRole(roles: RoleEnum | RoleEnum[]): Promise<void> {
    if (projectSetting.permissionMode !== PermissionModeEnum.ROUTE_MAPPING) {
      throw new Error(
        'Please switch PermissionModeEnum to ROUTE_MAPPING mode in the configuration to operate!',
      );
    }

    if (!isArray(roles)) {
      roles = [roles];
    }
    userStore.setRoleList(roles);
    await resume();
  }

  /**
   * refresh menu data
   */
  async function refreshMenu() {
    resume();
  }

  return { changeRole, hasPermission, togglePermissionMode, refreshMenu };
}
