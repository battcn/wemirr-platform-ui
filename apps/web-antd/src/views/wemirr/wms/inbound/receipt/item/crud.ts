import { compute, dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';
import createLocationCrudOptions from '#/views/wemirr/wms/basic/location/crud';
import createMaterialCrudOptions from '#/views/wemirr/wms/metadata/material/crud';

export default function crud({ crudExpose }) {
  return {
    crudOptions: {
      actionbar: {
        show: true,
        buttons: {
          add: { show: false },
          addRow: { show: false },
        },
      },
      search: { show: false },
      toolbar: {
        show: true,
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
        width: 100,
        align: 'center',
        group: {
          editable: {
            edit: { size: 'small', type: 'link' },
            save: { size: 'small', type: 'link' }, // 保存
            cancel: { size: 'small', type: 'link' }, // 退出编辑
            remove: { size: 'small', type: 'link', show: false },
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
          column: { show: true, width: 230 },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'materialName',
            getNodesByValues: async (values: any[]) => {
              return await defHttp.post('/wms/metadata/materials/ids', values);
            },
          }),
          form: {
            component: {
              disabled: true,
              crossPage: true,
              createCrudOptions: createMaterialCrudOptions,
            },
          },
        },
        locationId: {
          title: '储位',
          column: { show: true, width: 230 },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'locationName',
            getNodesByValues: async (values: any[]) => {
              return await defHttp.post('/wms/locations/ids', values);
            },
          }),
          form: {
            rules: [{ required: true, message: '请选择储位' }],
            show: compute(({ form }) => {
              return form.locationName;
            }),
            component: {
              crossPage: true,
              createCrudOptions: createLocationCrudOptions,
            },
          },
        },
        receivingQty: {
          title: '收货数量',
          type: 'number',
          column: { show: true, width: 140 },
          form: {
            component: { disabled: true },
            rules: [{ required: true, message: '请输入数量' }],
            valueChange: ({ value, form, ...content }: any) => {
              console.log('value', value, 'form', form, 'content', content);
            },
          },
        },
        receivingUnit: {
          title: '收货单位',
          type: 'text',
          column: { show: false, width: 140 },
          form: { component: { disabled: true } },
        },
        qty: {
          title: '入库数量',
          type: 'number',
          column: { show: true, width: 140 },
          form: { component: { disabled: true } },
        },
        unit: {
          title: '入库单位',
          type: 'text',
          column: { show: false, width: 140 },
          form: {
            component: { disabled: true },
          },
        },
        productionDate: {
          title: '生产日期',
          type: 'text',
          column: { show: true, width: 150 },
          valueResolve({ value, row, key }: any) {
            if (value !== null) {
              row[key] = dayjs(value).unix();
            }
          },
          valueBuilder({ value, row, key }: any) {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
          form: {
            component: { disabled: true },
          },
        },
        expiryDate: {
          title: '失效日期',
          type: 'text',
          column: {
            show: true,
            width: 150,
            editable: {},
            component: {
              valueResolve({ value, row, key }: any) {
                if (value !== null) {
                  row[key] = dayjs(value).unix();
                }
              },
              valueBuilder({ value, row, key }: any) {
                if (value !== null) {
                  row[key] = dayjs(value);
                }
              },
            },
          },
          valueResolve({ value, row, key }: any) {
            if (value !== null) {
              row[key] = dayjs(value).unix();
            }
          },
          valueBuilder({ value, row, key }: any) {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
          form: {
            component: { format: 'YYYY-MM-DD', disabled: true },
          },
        },
        batchNum: {
          title: '批次号',
          type: 'text',
          column: { show: true, width: 140 },
          form: {
            component: { disabled: true },
          },
        },
        unitPrice: {
          title: '单位价格',
          type: 'number',
          column: { show: true, width: 140 },
          form: {
            component: { disabled: true },
          },
        },
      },
    },
  };
}
