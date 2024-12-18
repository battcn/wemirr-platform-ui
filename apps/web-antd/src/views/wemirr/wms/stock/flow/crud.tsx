import { BusinessDictCode, businessDictFunc } from '@/api/dict/dict';
import dayjs from 'dayjs';

import * as api from './api';

export default function () {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery) => await api.PageList(query),
        addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        editRequest: async ({ form }: EditReq) => await api.UpdateObj(form),
        delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
      },
      toolbar: {},
      search: {
        container: {},
      },
      actionbar: {
        show: true,
        buttons: {
          add: { show: false },
        },
      },
      rowHandle: {
        width: 100,
        buttons: {
          edit: { show: false },
          remove: { show: false },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        keyword: {
          title: '关键字',
          type: 'text',
          column: { show: false },
          search: { show: true },
        },
        warehouseCode: {
          title: '仓库编码',
          type: 'text',
          column: { width: 160 },
        },
        warehouseName: {
          title: '仓库名称',
          type: 'text',
          column: { width: 200 },
        },
        productCode: {
          title: '产品编码',
          type: 'text',
          column: { width: 160 },
        },
        productName: {
          title: '产品名字',
          type: 'text',
          column: { width: 200 },
        },
        type: {
          title: '扫码类型',
          type: 'dict-select',
          dict: businessDictFunc(BusinessDictCode.WMS_SCAN_OPERATION_TYPE),
          search: { show: true },
          column: {
            width: 150,
            component: {
              color: 'auto',
            },
          },
        },
        quantity: {
          title: '数量',
          type: 'text',
          column: { width: 150 },
        },
        description: {
          title: '描述',
          type: 'textarea',
          column: { show: false },
          form: {
            col: {
              span: 24,
            },
          },
        },
        createdName: {
          title: '创建人',
          type: 'text',
          form: { show: false },
          column: { ellipsis: true, width: 160 },
        },
        createdTime: {
          title: '创建时间',
          column: { show: true, width: 170 },
          type: 'datetime',
          form: { show: false },
          valueBuilder({ value, row, key }: any) {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
    },
  };
}
