import type { CreateCrudOptionsRet } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';

export default function crud(): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) =>
          await defHttp.get(`/iam/i18n`, { params: query }),
        addRequest: async ({ form }: any) =>
          await defHttp.post('/iam/i18n', form),
        editRequest: async ({ form }: any) =>
          await defHttp.put(`/iam/i18n/${form.id}`, form),
        delRequest: async ({ row }: any) =>
          await defHttp.delete(`/iam/i18n/${row.id}`),
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        code: {
          title: '编码',
          search: { show: true },
          column: { show: true, width: 180 },
          type: 'text',
          form: {
            rules: [{ required: true, message: '编码不能为空' }],
          },
        },
        languages: {
          title: '语言区',
          type: ['text'],
          column: {
            show: false,
            component: { name: 'fs-values-format' },
          },
          form: {
            col: { span: 24 },
          },
        },
        remark: {
          title: '备注',
          type: ['textarea'],
          column: { show: true, width: 180 },
          form: { col: { span: 24 } },
        },
        createName: {
          title: '创建人',
          type: 'text',
          column: { show: true, width: 180 },
          addForm: { show: false },
          editForm: { show: false },
        },
        createTime: {
          title: '创建时间',
          type: ['datetime', 'wp-readonly-time'],
        },
      },
    },
  };
}
