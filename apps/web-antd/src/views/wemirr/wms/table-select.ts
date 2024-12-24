import { dict } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';
import aisleCrudOptionsTenant from '#/views/wemirr/wms/basic/aisle/crud';
import containerCrudOptionsTenant from '#/views/wemirr/wms/basic/container/crud';
import dockCrudOptionsTenant from '#/views/wemirr/wms/basic/dock/crud';
import locationCrudOptionsTenant from '#/views/wemirr/wms/basic/location/crud';
import locationSpecCrudOptionsTenant from '#/views/wemirr/wms/basic/location/spec/crud';
import storageAreaCrudOptionsTenant from '#/views/wemirr/wms/basic/storage-area/crud';
import warehouseCrudOptionsTenant from '#/views/wemirr/wms/basic/warehouse/crud';
import brandCrudOptionsTenant from '#/views/wemirr/wms/metadata/brand/crud';
import carrierCrudOptionsTenant from '#/views/wemirr/wms/metadata/carrier/crud';
import materialCrudOptions from '#/views/wemirr/wms/metadata/material/crud';
import supplierCrudOptionsTenant from '#/views/wemirr/wms/metadata/supplier/crud';

export function materialTable() {
  return {
    title: '物料',
    search: { show: true },
    type: 'table-select',
    dict: dict({
      value: 'id',
      label: 'name',
      getNodesByValues: async (values: any[]) => {
        return await defHttp.post('/wms/metadata/materials/ids', values);
      },
    }),
    column: { width: 160, component: { color: 'auto' } },
    form: {
      rules: [{ required: true, message: '请选择物料' }],
      component: {
        crossPage: true,
        valuesFormat: {
          labelFormatter: (item: any) => {
            return item.name;
          },
        },
        createCrudOptions: materialCrudOptions,
        crudOptionsOverride: {
          container: { is: 'fs-layout-default' },
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
  };
}

export function warehouseTable() {
  return {
    title: '仓库',
    search: { show: true },
    column: { width: 160, component: { color: 'auto' } },
    type: 'table-select',
    dict: dict({
      value: 'id',
      label: 'name',
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
            return item.name;
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
  };
}

export function storageAreaTable() {
  return {
    title: '库区',
    search: { show: true },
    column: { width: 160, component: { color: 'auto' } },
    type: 'table-select',
    dict: dict({
      value: 'id',
      label: 'name',
      getNodesByValues: async (values: any[]) => {
        return await defHttp.post('/wms/storage-areas/ids', values);
      },
    }),
    form: {
      rules: [{ required: true, message: '请选择库区' }],
      component: {
        crossPage: true,
        valuesFormat: {
          labelFormatter: (item: any) => {
            return item.name;
          },
        },
        createCrudOptions: storageAreaCrudOptionsTenant,
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
  };
}

export function aisleTable() {
  return {
    title: '巷道',
    search: { show: true },
    column: { width: 160, component: { color: 'auto' } },
    type: 'table-select',
    dict: dict({
      value: 'id',
      label: 'name',
      getNodesByValues: async (values: any[]) => {
        return await defHttp.post('/wms/aisles/ids', values);
      },
    }),
    form: {
      rules: [{ required: true, message: '请选择巷道' }],
      component: {
        crossPage: true,
        valuesFormat: {
          labelFormatter: (item: any) => {
            return item.name;
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
  };
}

export function locationSpecTable() {
  return {
    title: '储位规格',
    search: { show: true },
    column: { width: 160, component: { color: 'auto' } },
    type: 'table-select',
    dict: dict({
      value: 'id',
      label: 'name',
      getNodesByValues: async (values: any[]) => {
        return await defHttp.post('/wms/location-specs/ids', values);
      },
    }),
    form: {
      rules: [{ required: true, message: '请选择储位规格' }],
      component: {
        crossPage: true,
        valuesFormat: {
          labelFormatter: (item: any) => {
            return item.name;
          },
        },
        createCrudOptions: locationSpecCrudOptionsTenant,
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
  };
}

export function brandTable() {
  return {
    title: '品牌',
    search: { show: true },
    column: { width: 120, component: { color: 'auto' } },
    type: 'table-select',
    dict: dict({
      value: 'id',
      label: 'name',
      getNodesByValues: async (values: any[]) => {
        return await defHttp.post('/wms/metadata/brands/ids', values);
      },
    }),
    form: {
      rules: [{ required: true, message: '请选择品牌' }],
      component: {
        crossPage: true,
        valuesFormat: {
          labelFormatter: (item: any) => {
            return item.name;
          },
        },
        createCrudOptions: brandCrudOptionsTenant,
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
  };
}

export function supplierTable() {
  return {
    title: '供应商',
    search: { show: true },
    column: { width: 200, component: { color: 'auto' } },
    type: 'table-select',
    dict: dict({
      value: 'id',
      label: 'name',
      getNodesByValues: async (values: any[]) => {
        return await defHttp.post('/wms/metadata/suppliers/ids', values);
      },
    }),
    form: {
      rules: [{ required: true, message: '请选择供应商' }],
      component: {
        crossPage: true,
        valuesFormat: {
          labelFormatter: (item: any) => {
            return item.name;
          },
        },
        createCrudOptions: supplierCrudOptionsTenant,
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
  };
}

export function dockTable() {
  return {
    title: '月台',
    search: { show: false },
    column: { width: 120, component: { color: 'auto' } },
    type: 'table-select',
    dict: dict({
      value: 'id',
      label: 'name',
      getNodesByValues: async (values: any[]) => {
        return await defHttp.post('/wms/docks/ids', values);
      },
    }),
    form: {
      component: {
        show: true,
        crossPage: true,
        valuesFormat: {
          labelFormatter: (item: any) => {
            return item.name;
          },
        },
        createCrudOptions: dockCrudOptionsTenant,
        crudOptionsOverride: {
          container: { is: 'fs-layout-default' },
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
  };
}

export function containerTable() {
  return {
    title: '容器',
    search: { show: false },
    column: { width: 120, component: { color: 'auto' } },
    type: 'table-select',
    dict: dict({
      value: 'id',
      label: 'name',
      getNodesByValues: async (values: any[]) => {
        return await defHttp.post('/wms/containers/ids', values);
      },
    }),
    form: {
      component: {
        crossPage: true,
        valuesFormat: {
          labelFormatter: (item: any) => {
            return item.containerName;
          },
        },
        createCrudOptions: containerCrudOptionsTenant,
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
  };
}

export function locationTable() {
  return {
    title: '储位',
    search: { show: true },
    column: { width: 150, component: { color: 'auto' } },
    type: 'table-select',
    dict: dict({
      value: 'id',
      label: 'name',
      getNodesByValues: async (values: any[]) => {
        return await defHttp.post('/wms/locations/ids', values);
      },
    }),
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
          container: { is: 'fs-layout-default' },
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
  };
}

export function carrierTable() {
  return {
    title: '承运商',
    search: { show: true },
    column: { width: 200, component: { color: 'auto' } },
    type: 'table-select',
    dict: dict({
      value: 'id',
      label: 'name',
      getNodesByValues: async (values: any[]) => {
        return await defHttp.post('/wms/metadata/carriers/ids', values);
      },
    }),
    form: {
      rules: [{ required: true, message: '请选择承运商' }],
      component: {
        crossPage: true,
        valuesFormat: {
          labelFormatter: (item: any) => {
            return item.name;
          },
        },
        createCrudOptions: carrierCrudOptionsTenant,
        crudOptionsOverride: {
          container: { is: 'fs-layout-default' },
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
  };
}
