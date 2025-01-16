import { dict } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';

export default function crud() {
  return {
    crudOptions: {
      table: {},
      request: {
        pageRequest: async (query: any) =>
          await defHttp.post(`/bpm/process_categories/page`, query),
        addRequest: async ({ form }: any) =>
          await defHttp.post(`/bpm/process_categories/create`, form),
        editRequest: async ({ form }: any) =>
          await defHttp.put(`/bpm/process_categories/${form.id}`, form),
        delRequest: async ({ row }: any) =>
          await defHttp.delete(`/bpm/process_categories/${row.id}`),
      },
      toolbar: {},
      rowHandle: {},
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        code: {
          title: '编码',
          type: 'text',
          editForm: { component: { disabled: true } },
          column: { width: 150 },
          search: { show: true },
          form: {
            rules: [{ required: true, message: '编码不能为空' }],
          },
        },
        icon: {
          title: 'ICON',
          type: 'icon',
          column: {
            width: 100,
            align: 'center',
          },
          form: {
            component: {
              dialog: { title: 'ICON 选择' },
              tabs: { type: 'line' },
            },
            rules: [{ required: true, message: 'ICON 不能为空' }],
            helper: {
              render() {
                return (
                  <a
                    href={'https://iconify.design/icon-sets/ion/'}
                    target={'_blank'}
                  >
                    无满意的 ICON ? 请点我
                  </a>
                );
              },
            },
          },
        },
        name: {
          title: '名称',
          type: 'text',
          column: { width: 200 },
          search: { show: true },
          form: {
            rules: [{ required: true, message: '名称不能为空' }],
          },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          column: { width: 100, align: 'center' },
          search: { show: true },
          dict: dict({
            data: [
              {
                value: 1,
                label: '启用',
                color: 'success',
              },
              {
                value: 0,
                label: '禁用',
                color: 'error',
              },
            ],
          }),
          addForm: { value: 1 },
        },
        description: {
          title: '描述',
          search: { show: false },
          column: { ellipsis: true },
          type: ['textarea'],
          form: {
            rules: [{ required: true, message: '描述不能为空' }],
            col: {
              span: 24,
            },
          },
        },
        createdName: {
          title: '创建人',
          search: { show: false },
          type: 'text',
          addForm: { show: false },
          editForm: { show: false },
          column: { width: 150, ellipsis: true },
        },
        createdTime: {
          title: '创建时间',
          type: ['datetime', 'wp-readonly-time'],
        },
      },
    },
  };
}
