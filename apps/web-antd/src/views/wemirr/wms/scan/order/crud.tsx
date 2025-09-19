import type { UserPageQuery } from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';

import { BusinessDictCode, businessDictFunc } from '#/api/core/dict';

import createFlowCrudOptions from '../flow/crud';
import * as api from './api';

export default function crud() {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery) => await api.PageList(query),
        // addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        // editRequest: async ({ form }: EditReq) => await api.UpdateObj(form),
        // delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
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
        show: false,
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
          form: { show: false },
        },
        refCode: {
          title: '单据',
          dict: dict({
            value: 'id',
            label: 'name',
          }),
          column: {
            width: 180,
            component: {
              name: 'fs-table-select',
              // 设置为查看模式
              viewMode: true,
              createCrudOptions: createFlowCrudOptions,
              crudOptionsOverride: {
                columns: {
                  keyword: { search: { show: false } },
                },
                rowHandle: { show: false },
                toolbar: { show: false },
                actionbar: { show: false },
              },
              slots: {
                default({ scope, value }) {
                  async function open() {
                    // 打开时传入默认查询参数
                    const crudOptions = {
                      search: { initialForm: { refCode: value } },
                    };
                    const { crudExpose } = await scope.open({ crudOptions });
                    // 这里还能通过crudExpose等返回值操作表格
                  }
                  return <a onClick={open}>{value}</a>;
                },
              },
            },
          },
        },
        companyName: {
          title: '客户名称',
          type: 'text',
          column: { width: 180 },
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
