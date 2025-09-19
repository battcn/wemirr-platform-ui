import type {
  CreateCrudOptionsRet,
  ValueBuilderContext,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';

export default function crud(): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) =>
          await defHttp.get('/iam/message-notify/subscribe-list', {
            params: query,
          }),
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
          type: 'textarea',
          column: { ellipsis: true, width: 300 },
          form: {
            col: { span: 24 },
          },
        },
        createTime: {
          title: '通知时间',
          type: 'datetime',
          column: { show: true, width: 170 }, // 表单配置
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
    },
  };
}
