import { dict } from '@fast-crud/fast-crud';

import * as api from './api';

export default function crud() {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await api.PageList(query),
        addRequest: async ({ form }) => await api.AddObj(form),
        editRequest: async ({ form }) => await api.UpdateObj(form),
        delRequest: async ({ row }) => await api.DelObj(row.id),
      },
      toolbar: {},
      form: {
        wrapper: {
          is: 'a-modal',
        },
        watch({ form }) {
          if (form.unitPrice && form.quantity) {
            form.subtotalPrice = form.unitPrice * form.quantity;
          }
        },
      },
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

        purchaseNo: {
          title: '采购编号',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 150 },
          form: {
            show: false,
          },
        },
        partName: {
          title: '零件名称',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 150 },
          form: {
            rules: [{ required: true, message: '请输入零件名称' }],
          },
        },
        model: {
          title: '型号',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 150 },
          form: {
            rules: [{ required: true, message: '请输入型号' }],
          },
        },
        quantity: {
          title: '数量',
          type: 'number',
          column: { align: 'center', width: 150 },
          form: {
            rules: [{ required: true, message: '请输入数量' }],
          },
        },
        quantityUnit: {
          title: '单位',
          type: 'text',
          column: { align: 'center', width: 150 },
          form: {
            rules: [{ required: true, message: '请输入数量单位' }],
          },
        },
        availableQuantity: {
          title: '可用数量',
          type: 'number',
          column: { align: 'center', width: 150 },
          form: {
            rules: [{ required: true, message: '请输入可用数量' }],
          },
        },
        unitPrice: {
          title: '单价',
          type: 'number',
          column: { align: 'center', width: 150 },
          form: {
            component: { min: 0, max: 100_000 },
            rules: [{ required: true, message: '请输入单价' }],
          },
        },
        subtotalPrice: {
          title: '小计价格',
          type: 'number',
          column: { align: 'center', width: 150 },
          form: {
            component: { disabled: true },
          },
        },
        inStock: {
          title: '是否入库',
          type: 'dict-switch',
          search: { show: true },
          column: { align: 'center', width: 150 },
          dict: dict({
            data: [
              { value: true, label: '已入库', color: 'success' },
              { value: false, label: '未入库', color: 'warning' },
            ],
          }),
          form: {
            show: false,
          },
        },
        inStockTime: {
          title: '入库时间',
          type: 'datetime',
          column: { align: 'center', width: 180 },
          form: {
            show: false,
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
