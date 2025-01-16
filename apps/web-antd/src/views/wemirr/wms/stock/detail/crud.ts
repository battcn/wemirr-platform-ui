import type { UserPageQuery } from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';
import locationCrudOptionsTenant from '#/views/wemirr/wms/basic/location/crud';
import {
  aisleTable,
  materialTable,
  storageAreaTable,
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
          search: { show: true },
          column: { show: true, width: 120 },
        },
        materialId: materialTable(),
        warehouseId: warehouseTable(),
        areaId: storageAreaTable(),
        aisleId: aisleTable(),
        locationId: {
          title: '储位',
          search: { show: true },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'name',
            getNodesByValues: async (values: any[]) => {
              return await defHttp.post('/wms/locations/ids', values);
            },
          }),
          column: {
            width: 200,
            component: {
              color: 'auto',
              labelFormatter: (item: any) => {
                return `${item.code} - ${item.name}`;
              },
            },
          },
          form: {
            rules: [{ required: true, message: '请选择储位' }],
            component: {
              crossPage: true,
              valuesFormat: {
                labelFormatter: (item: any) => {
                  return item.name;
                },
              },
              createCrudOptions: locationCrudOptionsTenant,
              crudOptionsOverride: {
                container: {
                  is: 'fs-layout-default',
                },
                rowHandle: { show: false },
                toolbar: { show: false },
                actionbar: { show: false },
                columns: {
                  remark: { column: { show: false } },
                  areaText: { column: { show: false } },
                  area: { column: { show: false } },
                },
              },
            },
          },
        },
        productionDate: {
          title: '生产日期',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 140 },
          form: { show: true },
        },
        expiryDate: {
          title: '失效日期',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 140 },
          form: { show: true },
        },
        attribute: {
          title: '特殊属性',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: { show: true },
        },
        qty: {
          title: '库存数量',
          type: 'number',
          search: { show: false },
          column: { show: true, width: 100, fixed: 'right' },
          form: { show: true },
        },
        unit: {
          title: '库存单位',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 80, fixed: 'right' },
          form: { show: true },
        },
        level: {
          title: '存货等级',
          type: 'dict-switch',
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
          column: { show: true, width: 80, fixed: 'right' },
          form: { show: true },
        },
      },
    },
  };
}
