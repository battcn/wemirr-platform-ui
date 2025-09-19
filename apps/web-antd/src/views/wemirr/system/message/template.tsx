import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';

import { useRouter } from 'vue-router';

import { useAccess } from '@vben/access';

import { dict, utils } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';

export default function crud(
  props: CreateCrudOptionsProps,
): CreateCrudOptionsRet {
  const router = useRouter();
  const { hasPermission } = useAccess();

  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) =>
          await defHttp.request('/iam/message-template/page', {
            method: 'get',
            params: query,
          }),
        addRequest: async ({ form }: any) =>
          await defHttp.post('/iam/message-template/create', form),
        editRequest: async ({ form }: any) =>
          await defHttp.put(`/iam/message-template/${form.id}/modify`, form),
        delRequest: async ({ row }: any) =>
          await defHttp.delete(`/iam/message-template/${row.id}`),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {
          add: {
            icon: 'ph:plus-fill',
            text: '添加模板',
          },
        },
      },
      rowHandle: {
        width: 230,
        buttons: {
          publish: {
            show: hasPermission('message:template:publish'),
            order: 2,
            type: 'link',
            text: '推送',
            async click({ row }: any) {
              await router.push(`/sys/message/publish?id=${row.id}`);
            },
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
        code: {
          title: '编码',
          type: 'text',
          column: { show: true, width: 100 },
          form: {
            rules: [{ required: true, message: '模板编码不能为空' }],
          },
        },
        name: {
          title: '名称',
          type: 'text',
          column: { show: true, width: 160 },
          search: { show: true },
          form: {
            rules: [{ required: true, message: '模板名称不能为空' }],
          },
        },
        type: {
          title: '类型',
          search: { show: true },
          column: {
            show: true,
            width: 160,
            component: { color: 'auto', defaultLabel: '-/-' },
          },
          type: 'dict-select',
          dict: dict({
            data: [
              { value: 'system', label: '系统消息' },
              { value: 'ding-talk', label: '钉钉' },
              { value: 'email', label: '邮箱' },
              { value: 'sms', label: '短信' },
            ],
          }),
          addForm: { value: 'system' },
          form: {
            title: '多选本地',
            component: {
              mode: 'multiple',
              on: {
                selectedChange({ form, $event }) {
                  // $event就是原始的事件值，也就是选中的 option对象
                  utils.logger.info('onSelectedChange', form, $event);
                  // ui.message.info(`你选择了${JSON.stringify($event)}`);
                  // 你还可以将选中的label值赋值给表单里其他字段
                  // context.form.xxxLabel = context.$event.label
                },
              },
            },
            rules: [{ required: true, message: '请选择一个选项' }],
          },
        },
        subject: {
          title: '消息标题',
          type: 'text',
          column: { show: true, width: 200 },
          search: { show: true },
          form: {
            col: { span: 24 },
          },
        },
        content: {
          title: '模板内容',
          type: 'editor-wang5',
          column: { ellipsis: true, width: 200 },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: '模板内容不能为空' }],
          },
        },
        createName: {
          title: '发布人',
          type: 'text',
          column: { show: false, width: 180 },
          form: { show: false },
        },
        createTime: {
          title: '通知时间',
          type: ['datetime', 'wp-readonly-time'],
        },
      },
    },
  };
}
