import type {
  AddReq,
  DelReq,
  EditReq,
  UserPageQuery,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';
import unitCrudOptionsTenant from '#/views/wemirr/wms/metadata/unit/crud';

import * as api from './api';

export default function crud() {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery) => await api.GetList(query),
        addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        editRequest: async ({ form }: EditReq) => await api.UpdateObj(form),
        delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {},
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        unitId: {
          title: '基本单位',
          search: { show: true },
          column: { width: 140, component: { color: 'auto' } },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'symbol',
            getNodesByValues: async (values: any[]) => {
              return await defHttp.post('/wms/metadata/units/ids', values);
            },
          }),
          form: {
            rules: [{ required: true, message: '请选择基本计量单位' }],
            component: {
              crossPage: true,
              valuesFormat: {
                labelFormatter: (item: any) => {
                  return item.symbol;
                },
              },
              createCrudOptions: unitCrudOptionsTenant,
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
        },
        convUnitId: {
          title: '转换单位',
          search: { show: true },
          column: { width: 140, component: { color: 'auto' } },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'symbol',
            getNodesByValues: async (values: any[]) => {
              return await defHttp.post('/wms/metadata/units/ids', values);
            },
          }),
          form: {
            rules: [{ required: true, message: '请选择被转换的计量单位' }],
            component: {
              crossPage: true,
              valuesFormat: {
                labelFormatter: (item: any) => {
                  return item.symbol;
                },
              },
              createCrudOptions: unitCrudOptionsTenant,
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
        },
        numerator: {
          title: '转换分子',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 120 },
          form: {
            // 表单配置
            rules: [{ required: false, message: '请输入转换为基本单位的分子' }],
          },
        },
        denominator: {
          title: '转换分母',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 120 },
          form: {
            // 表单配置
            rules: [{ required: false, message: '请输入转换为基本单位的分母' }],
          },
        },
        description: {
          title: '描述',
          type: ['textarea'],
          column: { ellipsis: true, show: false },
          form: {
            col: { span: 24 },
            rules: [{ required: false, message: '请输入描述' }],
          },
        },
        createName: {
          title: '创建人',
          type: 'text',
          form: { show: false },
          column: { ellipsis: true, width: 160 },
        },
        createTime: {
          title: '创建时间',
          type: ['datetime', 'wp-readonly-time'],
        },
      },
    },
  };
}
