import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  UserPageQuery,
  ValueBuilderContext,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';

export default function crud(
  props: CreateCrudOptionsProps,
): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery) => {
          if (!query.parentId) {
            return undefined;
          }
          return await defHttp.get(
            `/iam/dict/items?parentId=${query.parentId}`,
            {
              params: query,
            },
          );
        },
        addRequest: async ({ form }: AddReq) =>
          await defHttp.post(`/iam/dict/create`, form),
        editRequest: async ({ form }: EditReq) =>
          await defHttp.put(`/iam/dict/${form.id}`, form),
        delRequest: async ({ row }: DelReq) =>
          await defHttp.delete(`/iam/dict/${row.dictId}/items/${row.id}`),
      },
      container: {
        is: 'fs-layout-default',
      },
      actionbar: { buttons: { add: { show: false } } },
      toolbar: { buttons: { refresh: { show: false } } },
      rowHandle: { width: 170, align: 'center' },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        parentId: {
          title: '上级字典ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        name: {
          title: '名称',
          search: { show: true },
          column: { show: true, width: 160 },
          type: 'text',
          form: {
            rules: [{ required: true, message: '编码不能为空' }],
          },
        },
        code: {
          title: '编码',
          search: { show: false },
          column: { show: true, width: 160 },
          type: 'text',
          form: {
            rules: [{ required: true, message: '编码不能为空' }],
          },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          column: { show: true, width: 100 },
          search: { show: true },
          dict: dict({
            data: [
              { value: 1, label: '启用', color: 'success' },
              { value: 0, label: '禁用', color: 'error' },
            ],
          }),
          addForm: { value: 1 },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = value === true ? 1 : 0;
            }
          },
        },
        sequence: {
          title: '排序',
          type: 'number',
          addForm: { value: 0 },
          column: { show: true, width: 80 },
          form: { component: { min: 0, max: 1000 } },
        },
        description: {
          title: '描述',
          column: { show: true, ellipsis: true, width: 180 },
          type: 'textarea',
          form: {
            col: { span: 24 },
          },
        },
        createdTime: {
          title: '创建时间',
          type: ['datetime', 'wp-readonly-time'],
        },
      },
    },
  };
}
