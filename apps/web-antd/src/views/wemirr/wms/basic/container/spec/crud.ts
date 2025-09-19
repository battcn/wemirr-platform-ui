import type {
  AddReq,
  DelReq,
  EditReq,
  UserPageQuery,
} from '@fast-crud/fast-crud';

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
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        name: {
          title: '名称',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160, fixed: 'left' },
          form: {
            rules: [
              { required: true, message: '请输入容器规格名称' },
              { min: 0, max: 255, message: '长度在 0 到 255 个字符' },
            ],
          },
        },
        status: {
          title: '状态',
          search: { show: true },
          column: { width: 100, component: { color: 'auto' } },
          type: 'dict-select',
          dict: sysDictFunc(SysDictCode.STATUS),
          form: {
            rules: [{ required: true, message: '请选择储位规格状态' }],
          },
        },
        length: {
          title: '长度(cm)',
          type: 'number',
          search: { show: false },
          column: { show: true, width: 100 },
          form: {
            rules: [{ required: true, message: '请输入长度' }],
          },
        },
        width: {
          title: '宽度(cm)',
          type: 'number',
          search: { show: false },
          column: { show: true, width: 100 },
          form: {
            rules: [{ required: true, message: '请输入宽度' }],
          },
        },
        height: {
          title: '高度(cm)',
          type: 'number',
          search: { show: false },
          column: { show: true, width: 100 },
          form: {
            rules: [{ required: true, message: '请输入高度' }],
          },
        },
        selfWeight: {
          title: '自重(kg)',
          type: 'number',
          search: { show: false },
          column: { show: true, width: 100 },
          form: {
            rules: [{ required: true, message: '请输入容器自重(kg)' }],
          },
        },
        loadLength: {
          title: '载长(cm)',
          type: 'number',
          search: { show: false },
          column: { show: true, width: 100 },
          form: {
            rules: [{ required: true, message: '请输入承载长度' }],
          },
        },
        loadWidth: {
          title: '载宽(cm)',
          type: 'number',
          search: { show: false },
          column: { show: true, width: 100 },
          form: {
            rules: [{ required: true, message: '请输入承载宽度' }],
          },
        },
        loadHeight: {
          title: '载高(cm)',
          type: 'number',
          search: { show: false },
          column: { show: true, width: 100 },
          form: {
            rules: [{ required: true, message: '请输入承载高度' }],
          },
        },
        loadWeight: {
          title: '载重(kg)',
          type: 'number',
          search: { show: false },
          column: { show: true, width: 100 },
          form: {
            rules: [{ required: true, message: '请输入承载重量(kg)' }],
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
