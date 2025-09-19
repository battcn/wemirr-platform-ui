import type { CreateCrudOptionsRet } from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';

export default function crud(): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) =>
          await defHttp.get('/iam/message-notify/page', { params: query }),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: { add: { show: false } },
      },
      rowHandle: {
        width: 80,
        align: 'center',
        buttons: {
          edit: { show: false },
          remove: { show: false },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        keyword: {
          title: '关键字',
          type: 'text',
          search: { show: true },
          form: { show: false },
          column: { show: false },
        },
        title: {
          title: '标题',
          type: 'text',
          column: { show: true, width: 170 },
        },
        type: {
          title: '类型',
          search: { show: true },
          column: { show: true, align: 'center', width: 160 },
          type: 'dict-select',
          dict: dict({
            data: [
              { value: 'system', label: '系统消息' },
              { value: 'ding-talk', label: '钉钉' },
              { value: 'email', label: '邮箱' },
              { value: 'sms', label: '短信' },
            ],
          }),
        },
        content: {
          title: '消息内容',
          type: ['textarea'],
          column: { ellipsis: true, width: 300 },
          form: { col: { span: 24 } },
        },
        nickname: {
          title: '订阅人',
          type: 'text',
          column: { show: true, width: 170 },
        },
        createName: {
          title: '推送人员',
          type: 'text',
          search: { show: false },
          column: { width: 160 },
        },
        createTime: {
          title: '推送时间',
          type: ['datetime', 'wp-readonly-time'],
        },
      },
    },
  };
}
