import { dict } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';
import aisleCrudOptionsTenant from '#/views/wemirr/wms/basic/aisle/crud';
import locationCrudOptionsTenant from '#/views/wemirr/wms/basic/location/crud';
import areaCrudOptionsTenant from '#/views/wemirr/wms/basic/storage-area/crud';
import warehouseCrudOptionsTenant from '#/views/wemirr/wms/basic/warehouse/crud';
import materialCrudOptions from '#/views/wemirr/wms/metadata/material/crud';

export default function crud() {
  return {
    crudOptions: {
      actionbar: {
        buttons: {
          add: { show: false },
          addRow: { show: true },
        },
      },
      search: { show: false },
      toolbar: {
        show: false,
        buttons: {
          refresh: { show: false },
          search: { show: false },
          export: { show: false },
        },
      },
      mode: {
        name: 'local',
        isMergeWhenUpdate: true,
        isAppendWhenAdd: true,
      },
      table: {
        editable: {
          enabled: true,
          mode: 'free',
          activeDefault: true,
          showAction: false,
        },
      },
      pagination: { show: false, pageSize: 9_999_999 },
      rowHandle: {
        width: 130,
        align: 'center',
        group: {
          editable: {
            // 行编辑模式
            edit: { size: 'small', type: 'link' },
            save: { size: 'small', type: 'link' }, // 保存
            cancel: { size: 'small', type: 'link' }, // 退出编辑
            remove: { size: 'small', type: 'link' },
          },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        materialId: {
          title: '物料',
          search: { show: true },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'materialName',
            getNodesByValues: async (values: any[]) => {
              return await defHttp.post('/wms/metadata/materials/ids', values);
            },
          }),
          column: {
            width: 200,
            fixed: 'left',
            component: {
              color: 'auto',
              labelFormatter: (item: any) => {
                return `${item.materialCode} - ${item.materialName}`;
              },
            },
          },
          form: {
            rules: [{ required: true, message: '请选择物料' }],
            component: {
              crossPage: true,
              valuesFormat: {
                labelFormatter: (item: any) => {
                  return item.materialDesc;
                },
              },
              createCrudOptions: materialCrudOptions,
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
        warehouseId: {
          title: '仓库',
          search: { show: true },
          column: { width: 120, component: { color: 'auto' }, fixed: 'left' },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'warehouseName',
            getNodesByValues: async (values: any[]) => {
              return await defHttp.post('/wms/warehouses/ids', values);
            },
          }),
          form: {
            rules: [{ required: true, message: '请选择仓库' }],
            component: {
              crossPage: true,
              valuesFormat: {
                labelFormatter: (item: any) => {
                  return item.warehouseName;
                },
              },
              createCrudOptions: warehouseCrudOptionsTenant,
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
        areaId: {
          title: '库区',
          search: { show: true },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'areaName',
            getNodesByValues: async (values: any[]) => {
              return await defHttp.post('/wms/storage-areas/ids', values);
            },
          }),
          column: {
            width: 140,
            component: {
              color: 'auto',
              labelFormatter: (item: any) => {
                return `${item.areaCode} - ${item.areaName}`;
              },
            },
          },
          form: {
            rules: [{ required: true, message: '请选择库区' }],
            component: {
              crossPage: true,
              valuesFormat: {
                labelFormatter: (item: any) => {
                  return item.areaName;
                },
              },
              createCrudOptions: areaCrudOptionsTenant,
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
        aisleId: {
          title: '巷道',
          search: { show: true },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'aisleName',
            getNodesByValues: async (values: any[]) => {
              return await defHttp.post('/wms/aisles/ids', values);
            },
          }),
          column: {
            width: 180,
            component: {
              color: 'auto',
              labelFormatter: (item: any) => {
                return `${item.aisleCode} - ${item.aisleName}`;
              },
            },
          },
          form: {
            rules: [{ required: true, message: '请选择巷道' }],
            component: {
              crossPage: true,
              valuesFormat: {
                labelFormatter: (item: any) => {
                  return item.aisleName;
                },
              },
              createCrudOptions: aisleCrudOptionsTenant,
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
        locationId: {
          title: '储位',
          search: { show: true },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'locationName',
            getNodesByValues: async (values: any[]) => {
              return await defHttp.post('/wms/locations/ids', values);
            },
          }),
          column: {
            width: 180,
            component: {
              color: 'auto',
              labelFormatter: (item: any) => {
                return `${item.locationCode} - ${item.locationName}`;
              },
            },
          },
          form: {
            rules: [{ required: true, message: '请选择储位' }],
            component: {
              crossPage: true,
              valuesFormat: {
                labelFormatter: (item: any) => {
                  return item.locationName;
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
        batchNum: {
          title: '批次号',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160 },
          form: { show: false },
        },
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
        attribute: {
          title: '特殊属性',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: { show: false },
        },
        qty: {
          title: '出库明细行数量',
          type: 'number',
          search: { show: false },
          column: { show: true, width: 100, fixed: 'right' },
          form: { show: false },
        },
        unit: {
          title: '库存单位',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 80, fixed: 'right' },
          form: { show: false },
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
          form: { show: false },
        },
      },
    },
  };
}
