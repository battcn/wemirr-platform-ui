import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  UserPageQuery,
  UserPageRes,
} from '@fast-crud/fast-crud';

import { compute, dict } from '@fast-crud/fast-crud';

import ReceiptItem from '#/views/wemirr/wms/inbound/receipt/item/index.vue';
import { supplierTable, warehouseTable } from '#/views/wemirr/wms/table-select';

import * as api from './api';

export default function crud(
  props: CreateCrudOptionsProps,
): CreateCrudOptionsRet {
  const { crudExpose } = props;
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery): Promise<UserPageRes> =>
          await api.GetList(query),
        addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        editRequest: async ({ form }: EditReq) => await api.UpdateObj(form),
        delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
        infoRequest: async ({ mode, row }) => {
          if (mode !== 'add') {
            return await api.GetObj(row.id);
          }
          return row;
        },
      },
      toolbar: {},
      actionbar: {
        buttons: { add: { show: false } },
      },
      form: { wrapper: { width: '85%' } },
      rowHandle: {
        width: 180,
        buttons: {
          view: {
            show: compute<boolean>(({ row }) => {
              return row.status !== 0;
            }),
          },
          edit: {
            size: 'small',
            text: '入库',
            show: compute<boolean>(({ row }) => {
              return row.status === 0;
            }),
          },
          // 删除
          remove: {
            show: compute(({ row }) => {
              return row.status === 0;
            }),
          },
        },
      },
      tabs: { name: 'status', show: true, type: 'line' },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        receiptNum: {
          title: '入库单号',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160, fixed: 'left' },
          editForm: { component: { disabled: true } },
        },
        planNum: {
          title: '收货计划号',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160, fixed: 'left' },
          editForm: { component: { disabled: true } },
        },
        supplierId: supplierTable(),
        warehouseId: warehouseTable(),
        status: {
          title: '状态',
          type: 'dict-radio',
          column: {
            show: true,
            width: 100,
            component: { color: 'auto' },
          },
          editForm: { component: { disabled: true } },
          dict: dict({
            data: [
              { value: 0, label: '草稿' },
              { value: 30, label: '已完成' },
              { value: -10, label: '已取消' },
            ],
          }),
        },
        items: {
          title: '入库单明细',
          type: 'text',
          column: { show: false },
          form: {
            col: { span: 24 },
            component: {
              name: ReceiptItem,
              vModel: 'modelValue',
            },
            valueResolve({ form }) {
              // 重要，移除$editable_id字段，返回干净的tableData数据
              form.items = crudExpose.editable.getTableData(form.items);
            },
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
