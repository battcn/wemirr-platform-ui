import { dict } from '@fast-crud/fast-crud';

import {
  aisleTable,
  locationSpecTable,
  storageAreaTable,
  warehouseTable,
} from '#/views/wemirr/wms/table-select';

import * as api from './api';

export default function ({ crudExpose }) {
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
        code: {
          title: '编号',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160, fixed: 'left' },
          form: {
            rules: [
              { required: true, message: '请输入储位编号' },
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
            rules: [
              { required: true, message: '请输入储位名称' },
              { min: 0, max: 255, message: '长度在 0 到 255 个字符' },
            ],
          },
        },
        warehouseId: warehouseTable(),
        storageAreaId: storageAreaTable(),
        aisleId: aisleTable(),
        specId: locationSpecTable(),
        type: {
          title: '类型',
          type: 'dict-select',
          search: { show: false },
          dict: dict({
            data: [
              { value: '1', label: '高储位', color: 'success' },
              { value: '0', label: '低储位', color: 'warning' },
            ],
          }),
          column: { show: true, width: 100 },
          form: {
            rules: [{ required: true, message: '请选择储位类型' }],
          },
        },
        pickingLevel: {
          title: '拣选等级',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 140 },
          form: {
            rules: [{ required: false, message: '请输入拣选储位销售等级' }],
            helper: '拣选储位销售等级',
          },
        },
        shelfLayer: {
          title: '货架层',
          type: 'textarea',
          search: { show: false },
          column: { show: true, width: 140 },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: '请输入位于货架第几层' }],
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
