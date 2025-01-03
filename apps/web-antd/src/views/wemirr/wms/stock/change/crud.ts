import type { UserPageQuery } from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';

import {
  locationTable,
  materialTable,
  warehouseTable,
} from '#/views/wemirr/wms/table-select';

import * as api from './api';

export default function crud() {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery) => await api.GetList(query),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {
          add: { show: false },
        },
      },
      rowHandle: {
        show: false,
        buttons: {
          edit: { show: false },
          remove: { show: false },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        batchNum: {
          title: '批次号',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: { show: false },
        },
        warehouseId: warehouseTable(),
        locationId: locationTable(),
        materialId: materialTable(),
        productionDate: {
          title: '生产日期',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: { show: false },
        },
        expiryDate: {
          title: '失效日期',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: { show: false },
        },
        qty: {
          title: '库存数量',
          type: 'number',
          search: { show: false },
          column: { show: true, width: 160 },
          form: { show: false },
        },
        unit: {
          title: '库存单位',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: { show: false },
        },
        changeType: {
          title: '变动类型',
          type: 'dict-select',
          search: { show: false },
          dict: dict({
            data: [
              { value: 0, label: '入库', color: 'success' },
              { value: 1, label: '出库', color: 'danger' },
              { value: 2, label: '盘盈入库', color: 'success' },
              { value: 3, label: '盘亏出库', color: 'danger' },
              { value: 4, label: '调整入库', color: 'success' },
              { value: 5, label: '调整出库', color: 'danger' },
              { value: 6, label: '报废出库', color: 'danger' },
              { value: 7, label: '报废入库', color: 'success' },
              { value: 8, label: '调拨入库', color: 'success' },
              { value: 9, label: '调拨出库', color: 'danger' },
              { value: 10, label: '其他入库', color: 'success' },
              { value: 11, label: '其他出库', color: 'danger' },
            ],
          }),
          column: { show: true, width: 160 },
          form: { show: false },
        },
        level: {
          title: '存货等级',
          type: 'dict-select',
          search: { show: false },
          dict: dict({
            data: [
              { value: 0, label: '良品', color: 'success' },
              { value: 10, label: '待检品', color: 'warning' },
              { value: 20, label: '不良品', color: 'danger' },
              { value: 30, label: '返工品', color: 'info' },
              { value: 40, label: '报废品', color: 'danger' },
              { value: 50, label: '退货品', color: 'danger' },
            ],
          }),
          column: { show: true, width: 160 },
          form: { show: false },
        },
        attribute: {
          title: '特殊属性',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: { show: false },
        },
      },
    },
  };
}
