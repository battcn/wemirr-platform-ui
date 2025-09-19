import type {
  AddReq,
  DelReq,
  EditReq,
  UserPageQuery,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';

import { SysDictCode, sysDictFunc } from '#/api';

import * as api from './api';

export default function crud({ crudExpose }) {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery) => await api.GetList(query),
        addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        editRequest: async ({ form }: EditReq) => await api.UpdateObj(form),
        delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {},
      },
      rowHandle: {
        width: 200,
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        code: {
          title: '编号',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160, fixed: 'left' },
          form: {
            // 表单配置
            rules: [
              { required: true, message: '请输入工作台编号' },
              { min: 0, max: 64, message: '长度在 0 到 64 个字符' },
            ],
          },
        },
        name: {
          title: '名称',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160, fixed: 'left' },
          form: {
            // 表单配置
            rules: [
              { required: true, message: '请输入工作台名称' },
              { min: 0, max: 255, message: '长度在 0 到 255 个字符' },
            ],
          },
        },
        status: {
          title: '状态',
          search: { show: true },
          column: { width: 160, component: { color: 'auto' } },
          type: 'dict-select',
          dict: sysDictFunc(SysDictCode.STATUS),
          form: {
            rules: [{ required: true, message: '请选择状态' }],
          },
        },
        type: {
          title: '类型',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [
              { required: true, message: '请输入工作台类型' },
              { min: 0, max: 64, message: '长度在 0 到 64 个字符' },
            ],
          },
        },
        category: {
          title: '类别',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [{ required: true, message: '请输入工作台类别' }],
          },
        },
        reviewMode: {
          title: '复核模式',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 120 },
          form: {
            // 表单配置
            rules: [{ required: false, message: '请输入复核模式' }],
          },
        },
        taskType: {
          title: '任务类型',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 120 },
          form: {
            // 表单配置
            rules: [{ required: false, message: '请输入任务类型' }],
          },
        },
        weightMode: {
          title: '称重模式',
          type: 'dict-select',
          search: { show: false },
          dict: dict({
            data: [
              { value: 'enabled', label: '启用', color: 'success' },
              { value: 'disabled', label: '不启用', color: 'error' },
              { value: 'conditional', label: '条件启用', color: 'warning' },
            ],
          }),
          column: { show: true, width: 120 },
          form: {
            // 表单配置
            rules: [{ required: false, message: '请选择称重模式' }],
          },
        },
        macAddress: {
          title: 'MAC地址',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 120 },
          form: {
            // 表单配置
            rules: [
              { required: false, message: '请输入MAC地址' },
              { min: 0, max: 64, message: '长度在 0 到 64 个字符' },
            ],
          },
        },
        createName: {
          title: '创建人',
          type: 'text',
          form: { show: false },
          column: { ellipsis: true, width: 160 },
        },
        createTime: {
          title: '创建时间',
          type: ['datetime', 'wp-readonly-time'],
        },
      },
    },
  };
}
