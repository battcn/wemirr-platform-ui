import { useRouter } from 'vue-router';

// import { downloadToFile } from '@/utils/file/download';
import { dict } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';

export default function crud() {
  const router = useRouter();
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) =>
          await defHttp.post('/suite/online-model/page', query),
        addRequest: async ({ form }: any) =>
          await defHttp.post('/suite/online-model/create', form),
        editRequest: async ({ form }: any) =>
          await defHttp.put(`/suite/online-model/${form.id}/modify`, form),
        delRequest: async ({ row }: any) =>
          await defHttp.delete(`/suite/online-model/${row.id}`),
      },
      table: {
        scroll: { fixed: true },
      },
      rowHandle: {
        width: 230,
        fixed: 'right',
        buttons: {
          formDesigner: {
            type: 'link',
            text: '表单设计',
            size: 'small',
            title: '表单设计',
            async click({ row }: any) {
              const routeUrl = router.resolve({
                path: `/dev/online/form-design?modelId=${row.id}`,
                query: { modelId: `${row.id}` },
              });
              await router.push(routeUrl);
            },
          },
          remove: { order: 2 },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        definitionKey: {
          title: '定义KEY',
          type: 'text',
          column: { width: 200 },
          search: { show: true },
          form: {
            col: { span: 24 },
            wrapperCol: { span: 9 },
            rules: [{ required: true, message: '定义KEY不能为空' }],
          },
        },
        title: {
          title: '标题',
          type: 'text',
          search: { show: true },
          column: { width: 200, ellipsis: true },
          form: {
            rules: [{ required: true, message: '标题不能为空' }],
          },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          form: { value: true },
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
          column: { width: 100 },
        },
        description: {
          title: '描述',
          type: ['textarea'],
          column: { width: 230, ellipsis: true },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: '描述不能为空' }],
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
