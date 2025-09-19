import type {
  AddReq,
  DelReq,
  EditReq,
  UserPageQuery,
} from '@fast-crud/fast-crud';

import { SysDictCode, sysDictFunc } from '#/api';
import { warehouseTable } from '#/views/wemirr/wms/table-select';

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
        width: 180,
      },
      form: {},
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
          search: { show: true },
          column: { show: true, width: 150, fixed: 'left' },
          form: {
            // 表单配置
            rules: [
              { required: true, message: '请输入库区编号' },
              { min: 0, max: 64, message: '长度在 0 到 64 个字符' },
            ],
          },
        },
        name: {
          title: '名称',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 150, fixed: 'left' },
          form: {
            // 表单配置
            rules: [
              { required: true, message: '请输入库区名称' },
              { min: 0, max: 255, message: '长度在 0 到 255 个字符' },
            ],
          },
        },
        type: {
          title: '类型',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 130 },
          form: {
            // 表单配置
            rules: [
              { required: true, message: '请输入库区类型' },
              { min: 0, max: 64, message: '长度在 0 到 64 个字符' },
            ],
          },
        },
        warehouseId: warehouseTable(),
        status: {
          title: '状态',
          search: { show: true },
          column: { width: 100, component: { color: 'auto' } },
          type: 'dict-select',
          dict: sysDictFunc(SysDictCode.STATUS),
          form: {
            rules: [{ required: true, message: '请选择库区状态' }],
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
