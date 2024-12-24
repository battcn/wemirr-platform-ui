import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  UserPageQuery,
  UserPageRes,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';

export default function crud(
  props: CreateCrudOptionsProps,
): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        pageRequest: async (
          query: UserPageQuery,
        ): Promise<UserPageRes> | undefined => {
          if (!query.dictId) {
            return undefined;
          }
          return await defHttp.get(`/iam/dict/${query.dictId}/items`, {
            params: query,
          });
        },
        addRequest: async ({ form }: AddReq) =>
          await defHttp.post(`/iam/dict/${form.dictId}/items`, form),
        editRequest: async ({ form }: EditReq) =>
          await defHttp.put(`/iam/dict/${form.dictId}/items/${form.id}`, form),
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
        dictId: {
          title: '字典ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        dictCode: {
          title: '编码',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        label: {
          title: '名称',
          search: { show: true },
          column: { show: true, width: 160 },
          type: 'text',
          form: {
            rules: [{ required: true, message: '编码不能为空' }],
          },
        },
        value: {
          title: '值',
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
          valueBuilder({ value, row, key }: any) {
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
          type: 'datetime',
          column: { width: 180 },
          form: { show: false },
          valueBuilder({ value, row, key }: any) {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
    },
  };
}
