import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { BusinessDictCode, businessDictFunc } from '#/api';
import { defHttp } from '#/api/request';
import truckCrudOptionsText from '#/views/wemirr/tms/resource/truck/crud';

import * as api from './api';

export default function () {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) => await api.PageList(query),
        addRequest: async ({ form }: any) => await api.AddObj(form),
        editRequest: async ({ form }: any) => await api.UpdateObj(form),
        delRequest: async ({ row }: any) => await api.DelObj(row.id),
      },
      toolbar: {},
      search: {},
      form: {
        wrapper: {
          is: 'a-modal',
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
        expenseNo: {
          title: '规费号',
          type: 'text',
          search: { show: true },
          column: { width: 170 },
          form: {
            show: false,
          },
        },
        expenseItem: {
          title: '费用项目',
          type: 'dict-select',
          // TMS_EXPENSE_ITEM
          dict: businessDictFunc(BusinessDictCode.TMS_EXPENSE_ITEM),
          search: { show: true },
          column: {
            width: 150,
            component: {
              color: 'auto',
            },
          },
          form: {
            rules: [{ required: true, message: '请选择费用项目' }],
          },
        },
        truckId: {
          title: '车辆',
          column: { show: false },
          type: 'table-select',
          dict: dict({
            getNodesByValues: async (values: any[]) => {
              return defHttp.get('/tms/trucks/dict-list', { params: values });
            },
          }),
          form: {
            component: {
              crossPage: true,
              valuesFormat: {
                labelFormatter: (item: any) => {
                  return item.label;
                },
              },
              select: {
                placeholder: '点击选择',
              },
              createCrudOptions: truckCrudOptionsText,
              crudOptionsOverride: {
                rowHandle: { show: false },
                toolbar: { show: false },
                actionbar: { show: false },
              },
              columns: {
                enabled: { column: { show: false } },
                isExternal: { column: { show: false } },
                tiresCount: { column: { show: false } },
                axlesCount: { column: { show: false } },
                fileNo: { column: { show: false } },
                plateColor: { column: { show: false } },
                usageType: { column: { show: false } },
                engineCode: { column: { show: false } },
                approvedPassenger: { column: { show: false } },
                totalWeight: { column: { show: false } },
                curbWeight: { column: { show: false } },
                approvedWeight: { column: { show: false } },
                towWeight: { column: { show: false } },
                roadCertificateCode: { column: { show: false } },
                ownerName: { column: { show: false } },
                ownerIdCardNo: { column: { show: false } },
                isAffiliation: { column: { show: false } },
                trailerId: { column: { show: false } },
                createName: { column: { show: false } },
                createTime: { column: { show: false } },
              },
            },
            rules: [{ required: true, message: '请选择车辆' }],
          },
        },
        amount: {
          title: '金额',
          type: 'text',
          column: { ellipsis: true, width: 100 },
          form: {
            rules: [{ required: true, message: '请输入金额' }],
          },
        },
        expiryDate: {
          title: '到期日期',
          type: 'date',
          column: { ellipsis: true, width: 150 },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD',
            },
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
        handlingDate: {
          title: '办理日期',
          type: 'date',
          column: { ellipsis: true, width: 180 },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD',
            },
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
        agentName: {
          title: '经办人',
          type: 'text',
          column: { ellipsis: true, width: 200 },
          form: {
            rules: [{ required: true, message: '请输入经办人姓名' }],
          },
        },
        remark: {
          title: '备注',
          column: { show: false },
          type: ['textarea'],
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
