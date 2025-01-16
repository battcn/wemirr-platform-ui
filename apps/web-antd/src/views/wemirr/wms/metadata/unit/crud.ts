import type {
  AddReq,
  DelReq,
  EditReq,
  UserPageQuery,
} from '@fast-crud/fast-crud';

import { SysDictCode, sysDictFunc } from '#/api';

import * as api from './api';

export default function crud() {
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
          title: '中文名称',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 140 },
          form: {
            rules: [{ required: true, message: '请输入计量单位中文名称' }],
          },
        },
        nameEn: {
          title: '英文名称',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 140 },
          form: {
            rules: [{ required: true, message: '请输入计量单位英文名称' }],
          },
        },
        symbol: {
          title: '符号',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 120 },
          form: {
            rules: [{ required: true, message: '请输入计量单位符号' }],
          },
        },
        type: {
          title: '类型',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 120 },
          form: {
            rules: [{ required: true, message: '请输入计量单位类型' }],
          },
        },
        status: {
          title: '状态',
          search: { show: false },
          column: { width: 120, component: { color: 'auto' } },
          type: 'dict-select',
          dict: sysDictFunc(SysDictCode.STATUS),
          form: {
            // 表单配置
            rules: [{ required: true, message: '请选择状态' }],
          },
        },
        description: {
          title: '描述',
          type: 'textarea',
          column: { ellipsis: true, width: 200 },
          form: {
            col: { span: 24 },
          },
        },
      },
    },
  };
}
