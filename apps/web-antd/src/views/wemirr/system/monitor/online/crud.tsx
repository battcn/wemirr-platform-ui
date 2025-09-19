import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
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
          await defHttp.get<any>('/iam/token/online', { params: { ...query } }),
        delRequest: async ({ row }: DelReq) =>
          await defHttp.delete(`/iam/token/${row.token}`),
      },
      table: { scroll: { fixed: true } },
      actionbar: { show: true, buttons: { add: { show: false } } },
      rowHandle: {
        width: 130,
        // 固定右侧
        fixed: 'right',
        buttons: {
          view: { size: 'small' },
          edit: { size: 'small', show: false },
          remove: { size: 'small', text: '下线' },
        },
      },
      columns: {
        token: {
          title: '令牌',
          type: 'textarea',
          column: {
            width: 200,
            fixed: 'left',
            ellipsis: true,
            component: { color: 'auto' },
          },
          form: {
            col: { span: 24 },
          },
        },
        principal: {
          title: '账号',
          type: 'text',
          search: { show: true },
          column: { width: 180, fixed: 'left' },
        },
        createName: {
          title: '登录人',
          type: 'text',
          search: { show: false },
          column: { width: 160, fixed: 'left' },
        },
        createTime: {
          title: '登录时间',
          type: 'datetime',
          column: { width: 160, fixed: 'left' },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
        loginType: {
          title: '登录类型',
          type: 'text',
          column: { width: 160 },
        },
        ip: {
          title: 'IP',
          type: 'text',
          column: { width: 160 },
        },
        location: {
          title: '登录地',
          type: 'text',
          column: { width: 180 },
        },
        clientId: {
          title: '应用标识',
          type: 'text',
          search: { show: true },
          column: { width: 200, component: { color: 'auto' } },
        },
        platform: {
          title: '操作平台',
          type: 'dict-select',
          dict: dict({
            data: [
              { value: 'Mac', label: 'Mac' },
              { value: 'Windows', label: 'Windows' },
              { value: 'Android', label: 'Android' },
              { value: 'iPhone', label: 'iPhone' },
              { value: 'Linux', label: 'Linux' },
              { value: 'Java', label: 'Java' },
            ],
          }),
          column: { width: 100, component: { color: 'auto' } },
          search: { show: true },
        },
        os: {
          title: '操作系统',
          type: 'text',
          column: { width: 100, ellipsis: true, component: { color: 'auto' } },
        },
        engine: {
          title: '引擎类型',
          type: 'text',
          column: { width: 100, component: { color: 'auto' } },
        },
        browser: {
          title: '浏览器',
          type: 'text',
          column: { width: 100, component: { color: 'auto' } },
        },
      },
      form: {
        display: 'flex',
        group: {
          type: 'collapse',
          accordion: false,
          groups: {
            baseInfo: {
              header: '基础信息',
              columns: [
                'token',
                'principal',
                'loginType',
                'createName',
                'createTime',
                'ip',
                'location',
              ],
            },
            reqInfo: {
              header: '请求信息',
              columns: ['clientId', 'platform', 'os', 'engine', 'browser'],
            },
          },
        },
      },
    },
  };
}
