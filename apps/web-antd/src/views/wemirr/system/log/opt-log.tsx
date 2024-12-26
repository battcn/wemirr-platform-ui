import type {
  CreateCrudOptionsRet,
  ValueBuilderContext,
  ValueResolveContext,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';

export default function crud(): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) =>
          await defHttp.get('/iam/opt_logs', { params: query }),
      },
      table: { scroll: { fixed: true } },
      actionbar: { show: true, buttons: { add: { show: false } } },
      rowHandle: {
        width: 80,
        // 固定右侧
        fixed: 'right',
        buttons: {
          view: { size: 'small' },
          edit: { show: false },
          remove: { size: 'small', show: false },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          column: { show: false },
          viewForm: { show: false },
        },
        'basic-info': {
          title: '基础信息',
          children: {
            ip: {
              title: 'IP',
              type: 'text',
              column: { width: 140 },
            },
            location: {
              title: '登录地',
              type: 'text',
              column: { width: 200 },
            },
            action: {
              title: '请求方法',
              type: 'textarea',
              column: { ellipsis: true, width: 300 },
              form: {
                col: { span: 24 },
              },
            },
            module: {
              title: '模块',
              type: ['text'],
              search: { show: false },
              column: { width: 200 },
            },
            description: {
              title: '描述信息',
              type: ['textarea'],
              search: { show: false },
              column: { width: 200 },
              form: { col: { span: 24 } },
            },
            status: {
              title: '状态',
              type: 'dict-switch',
              column: { ellipsis: true, width: 100 },
              dict: dict({
                data: [
                  { value: true, label: '正常', color: 'success' },
                  { value: false, label: '异常', color: 'error' },
                ],
              }),
            },
          },
        },

        'http-info': {
          title: 'HTTP 信息',
          children: {
            httpMethod: {
              title: 'HTTP方式',
              type: 'dict-select',
              column: { width: 100, component: { color: 'auto' } },
              search: { show: true },
              dict: dict({
                data: [
                  { value: 'GET', label: 'GET' },
                  { value: 'POST', label: 'POST' },
                  { value: 'PUT', label: 'PUT' },
                  { value: 'DELETE', label: 'DELETE' },
                  { value: 'PATCH', label: 'PATCH' },
                ],
              }),
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
              column: {
                width: 100,
                ellipsis: true,
                component: { color: 'auto' },
              },
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
        },

        'opt-info': {
          title: '操作信息',
          children: {
            createdName: {
              title: '操作人',
              type: 'text',
              column: { width: 180 },
            },
            startTime: {
              title: '开始时间',
              type: 'datetime',
              column: { width: 180 },
              valueBuilder({ value, row, key }: ValueBuilderContext): void {
                if (value !== null) {
                  row[key] = dayjs(value);
                }
              },
            },
            endTime: {
              title: '结束时间',
              type: 'datetime',
              column: { width: 180 },
              valueBuilder({ value, row, key }: ValueBuilderContext): void {
                if (value !== null) {
                  row[key] = dayjs(value);
                }
              },
            },
            duration: {
              title: '耗时',
              type: 'text',
              column: { width: 100 },
            },
          },
        },
        response: {
          title: '响应结果',
          type: 'json',
          column: { show: false },
          form: {
            col: { span: 24 },
            valueBuilder({ form }: ValueBuilderContext) {
              if (form.response) {
                form.response = JSON.parse(form.response);
              }
            },
            valueResolve({ form }: ValueResolveContext) {
              if (form.response) {
                form.response = JSON.stringify(form.response);
              }
            },
          },
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
              columns: ['ip', 'location', 'module', 'description', 'status'],
            },
            reqInfo: {
              header: '请求信息',
              columns: [
                'action',
                'httpMethod',
                'platform',
                'os',
                'engine',
                'browser',
              ],
            },
            otherInfo: {
              header: '其它信息',
              columns: [
                'startTime',
                'endTime',
                'duration',
                'createdName',
                'response',
              ],
            },
          },
        },
      },
    },
  };
}
