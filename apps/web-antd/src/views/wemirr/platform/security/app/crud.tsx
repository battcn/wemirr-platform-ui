import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  ValueBuilderContext,
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
        pageRequest: async (query: any) =>
          await defHttp.get(`/iam/registered-client`, { params: query }),
        addRequest: async ({ form }: AddReq) => {
          form.tokenSettings = {
            accessTokenTimeToLive: form.accessTokenTimeToLive,
            refreshTokenTimeToLive: form.refreshTokenTimeToLive,
          };
          await defHttp.post(`/iam/registered-client`, form);
        },
        editRequest: async ({ form }: EditReq) => {
          form.tokenSettings = {
            accessTokenTimeToLive: form.accessTokenTimeToLive,
            refreshTokenTimeToLive: form.refreshTokenTimeToLive,
          };
          await defHttp.put(`/iam/registered-client/${form.id}`, form);
        },
        delRequest: async ({ row }: DelReq) =>
          await defHttp.delete(`/iam/registered-client/${row.id}`),
      },
      table: {
        rowKey: 'clientId',
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        clientName: {
          title: '客户名称',
          type: 'text',
          column: { ellipsis: true, width: 180 },
          search: { show: true },
          form: {
            rules: [{ required: true, message: '客户名称不能为空' }],
          },
        },
        clientId: {
          title: '客户标识',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 140 },
          editForm: { component: { disabled: true } },
          form: {
            rules: [{ required: true, message: 'clientId 不能为空' }],
          },
        },
        clientSecret: {
          title: '客户秘钥',
          type: 'text',
          column: { width: 140, show: true },
          // editForm: { show: false },
          form: {
            rules: [{ required: true, message: 'clientSecret 不能为空' }],
            // helper: '注意：填写后将以密文方式存储且不允许修改',
          },
        },
        clientIdIssuedAt: {
          title: '生效时间',
          column: { width: 200 },
          type: 'datetime',
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
          valueResolve({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).unix();
            }
          },
          form: {
            helper: '不填则默认当前时间',
          },
        },
        clientSecretExpiresAt: {
          title: '过期时间',
          column: { width: 200 },
          type: 'datetime',
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
          valueResolve({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).unix();
            }
          },
          form: {
            helper: '不填则永不失效',
          },
        },
        grantTypes: {
          title: '授权类型',
          type: 'dict-select',
          form: {
            rules: [{ required: true, message: '授权范围不能为空' }],
            component: { mode: 'multiple' },
          },
          dict: dict({
            data: [
              { value: 'password', label: '密码模式' },
              { value: 'sms', label: '短信登录' },
              { value: 'email', label: '邮箱模式' },
              { value: 'vc_code', label: '验证码模式' },
            ],
          }),
          column: { width: 200, component: { color: 'auto' } },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          column: { show: true, width: 80 },
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
        accessTokenTimeToLive: {
          title: 'AT 有效期',
          type: 'text',
          column: { ellipsis: true, width: 180 },
          addForm: {
            value: '120',
          },
          form: {
            component: {
              addonAfter: '分钟',
            },
            rules: [{ required: true, message: 'Access Token有效期不能为空' }],
            helper: 'Access Token有效期,默认2小时',
          },
        },
        // 暂时没啥用不放出来了
        refreshTokenTimeToLive: {
          title: 'RF 有效期',
          type: 'text',
          column: { ellipsis: true, width: 180, show: false },
          addForm: {
            value: '4320',
          },
          form: {
            component: {
              addonAfter: '分钟',
            },
            show: false,
            rules: [{ required: true, message: 'Token有效期不能为空' }],
            helper: 'Refresh Token有效期,默认3天(4320)',
          },
        },
        redirectUris: {
          title: '回调地址',
          type: 'textarea',
          column: { ellipsis: true, show: false },
          form: {
            rules: [{ required: true, message: '请填写回调地址' }],
            col: {
              span: 24,
            },
          },
        },
      },
    },
  };
}
