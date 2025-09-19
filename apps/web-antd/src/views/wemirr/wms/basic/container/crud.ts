import type {
  AddReq,
  DelReq,
  EditReq,
  UserPageQuery,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';

import * as api from './api';
import containerSpecCrudOptionsTenant from './spec/crud';

export default function ({ crudExpose }) {
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
      rowHandle: {},
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        code: {
          title: '编号',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160, fixed: 'left' },
          form: {
            // 表单配置
            rules: [{ required: true, message: '请输入容器编码' }],
          },
        },
        name: {
          title: '名称',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [{ required: true, message: '请输入容器名称' }],
          },
        },
        specId: {
          title: '容器规格',
          search: { show: true },
          column: { width: 120, component: { color: 'auto' } },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'name',
            getNodesByValues: async (values: any[]) => {
              return await defHttp.post('/wms/container-specs/ids', values);
            },
          }),
          form: {
            rules: [{ required: true, message: '请选择容器规格' }],
            component: {
              crossPage: true,
              valuesFormat: {
                labelFormatter: (item: any) => {
                  return item.name;
                },
              },
              createCrudOptions: containerSpecCrudOptionsTenant,
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
        remark: {
          title: '用途',
          type: 'textarea',
          search: { show: false },
          column: { show: true, width: 200 },
          form: {
            rules: [{ required: true, message: '请输入容器用途' }],
            col: { span: 24 },
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
