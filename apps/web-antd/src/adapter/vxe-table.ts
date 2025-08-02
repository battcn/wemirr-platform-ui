import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';

import { h } from 'vue';

import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Button, Image } from 'ant-design-vue';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: false,
        columnConfig: {
          resizable: true,
        },
        minHeight: 180,
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'items',
            total: 'total',
            list: 'items',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        round: true,
        showOverflow: true,
        size: 'small',
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellImage' },
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(_renderOpts, params) {
        const { column, row } = params;
        return h(Image, { src: row[column.field] });
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          Button,
          { size: 'small', type: 'link' },
          { default: () => props?.text },
        );
      },
    });

    // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
    // vxeUI.formats.add
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';
/**
 * 判断vxe-table的复选框是否选中
 * @param tableApi api
 * @returns boolean
 */
export function vxeCheckboxChecked(
  tableApi: ReturnType<typeof useVbenVxeGrid>[1],
) {
  return tableApi?.grid?.getCheckboxRecords?.()?.length > 0;
}

/**
 * 通用的 排序参数添加到请求参数中
 * @param params 请求参数
 * @param sortList vxe-table的排序参数
 */
export function addSortParams(
  params: Record<string, any>,
  sortList: VxeGridPropTypes.ProxyAjaxQuerySortCheckedParams[],
) {
  // 这里是排序取消 length为0 就不添加参数了
  if (sortList.length === 0) {
    return;
  }
  // 支持单/多字段排序
  const orderByColumn = sortList.map((item) => item.field).join(',');
  const isAsc = sortList.map((item) => item.order).join(',');
  params.orderByColumn = orderByColumn;
  params.isAsc = isAsc;
}
