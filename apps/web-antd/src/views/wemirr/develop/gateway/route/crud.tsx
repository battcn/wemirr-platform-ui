import type {
  AddReq,
  DelReq,
  EditReq,
  UserPageQuery,
} from '@fast-crud/fast-crud';

import { compute, dict } from '@fast-crud/fast-crud';
import { notification } from 'ant-design-vue';

import * as api from './api';

export default function crud({ expose }) {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery) => {
          return await api.GetList(query);
        },
        addRequest: async ({ form }: AddReq) => {
          return await api.SaveOrUpdate(form);
        },
        editRequest: async ({ form }: EditReq) => {
          return await api.SaveOrUpdate(form);
        },
        delRequest: async ({ row }: DelReq) => {
          return await api.DelObj(row.id);
        },
      },
      table: {
        scroll: { fixed: true },
      },
      rowHandle: {
        fixed: 'right',
        width: 230,
        buttons: {
          edit: {
            show: compute(({ row }) => {
              return row.dynamic;
            }),
          },
          remove: {
            show: compute(({ row }) => {
              return row.dynamic;
            }),
          },
          up: {
            type: 'link',
            text: '上线',
            title: '上线',
            icon: null,
            size: 'small',
            order: 2,
            show: compute(({ row }) => {
              return row.dynamic && !row.status;
            }),
            async click({ row }: any) {
              await api.ServiceStatus(row.id, true).then(() => {
                notification.success({ message: '路由发布成功', duration: 2 });
              });
              expose.doRefresh();
            },
          },
          down: {
            type: 'link',
            text: null,
            title: '下线',
            icon: 'bi:cloud-arrow-down',
            size: 'small',
            order: 5,
            show: compute(({ row }) => {
              return row.dynamic && row.status;
            }),
            async click({ row }: any) {
              await api.ServiceStatus(row.id, false).then(() => {
                notification.success({ message: '路由下线成功', duration: 2 });
              });
              expose.doRefresh();
            },
          },
        },
      },
      search: { show: false },
      columns: {
        id: {
          title: '路由ID',
          type: 'text',
          column: { ellipsis: true, width: 280 },
          editForm: {
            component: {
              disabled: true,
            },
          },
          form: {
            rules: [{ required: true, message: '路由ID不能为空' }],
            helper: '路由ID一经录入无法修改',
          },
        },
        name: {
          title: '服务名',
          type: 'text',
          column: { ellipsis: true, width: 240 },
          form: {
            rules: [{ required: true, message: '路由名称不能为空' }],
            helper: '请填写正确的ServiceId,否则影响路由',
          },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          column: { width: 70, align: 'center' },
          search: { show: true },
          dict: dict({
            data: [
              { value: true, label: '运行中', color: 'success' },
              { value: false, label: '已停止', color: 'error' },
            ],
          }),
          form: {
            show: false,
            helper: '如果服务未注册成功,上线会失败',
          },
        },
        dynamic: {
          title: '路由类型',
          type: 'dict-radio',
          column: { width: 90, align: 'center' },
          dict: dict({
            data: [
              { value: true, label: '动态路由', color: 'warning' },
              { value: false, label: '初始路由', color: 'success' },
            ],
          }),
          form: { show: false },
        },
        order: {
          title: '拦截顺序',
          type: ['number'],
          column: { width: 90 },
          addForm: { value: 0 },
        },
        uri: {
          title: 'URI',
          column: { ellipsis: true, width: 280 },
          type: 'text',
          form: {
            rules: [{ required: true, message: '路由URI不能为空' }],
          },
        },
        description: {
          title: '描述',
          column: { ellipsis: true, width: 200 },
          type: ['textarea'],
          form: {
            col: { span: 24 },
          },
        },
        predicates: {
          title: '条件过滤',
          type: ['text'],
          column: { show: false },
          form: {
            col: { span: 24 },
          },
        },
        filters: {
          title: '过滤器',
          type: ['text'],
          column: {
            show: false,
            component: { name: 'fs-values-format' },
          },
          form: {
            col: { span: 24 },
          },
        },
        createTime: {
          title: '创建时间',
          type: ['datetime', 'wp-readonly-time'],
        },
      },
    },
  };
}
