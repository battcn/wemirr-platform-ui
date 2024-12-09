import { useAccess } from '@vben/access';

import _ from 'lodash-es';

/**
 * 设置动作权限
 * @param {object} permission - 权限对象
 * @param {string} permission.permission - 权限名称
 * @param {prefix} permission.prefix - 权限前缀
 */
export function useCrudPermission({ permission }) {
  const { hasPermission } = useAccess();
  const prefix = permission instanceof Object ? permission.prefix : permission;

  // 根据权限显示按钮
  function hasActionPermission(action) {
    if (!prefix) {
      return true;
    }
    return hasPermission(`${prefix}:${action}`);
  }

  function buildCrudPermission() {
    if (permission === null) {
      return {};
    }

    let extra = {};
    if (permission instanceof Object) {
      extra = permission.extra;
      if (permission.extra && permission.extra instanceof Function) {
        extra = permission.extra({ hasActionPermission });
      }
    }

    return _.merge(
      {
        actionbar: {
          buttons: {
            add: { show: hasActionPermission('add') },
          },
        },
        rowHandle: {
          buttons: {
            edit: { show: hasActionPermission('edit') },
            remove: { show: hasActionPermission('remove') },
            // view: { show: hasActionPermission('view') },
          },
        },
      },
      extra,
    );
  }

  function merge(userOptions) {
    const permissionOptions = buildCrudPermission();
    _.merge(permissionOptions, userOptions);
    return permissionOptions;
  }

  return { merge, buildCrudPermission, hasActionPermission };
}
