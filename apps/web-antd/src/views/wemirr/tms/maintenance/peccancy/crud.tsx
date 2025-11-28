import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';
import driverCrudOptionsText from '#/views/wemirr/tms/resource/driver/crud';
import truckCrudOptionsText from '#/views/wemirr/tms/resource/truck/crud';

import * as api from './api';

export default function () {
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
        wrapper: {},
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
        peccancyNo: {
          title: '违章编号',
          type: 'text',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
          form: {
            rules: [{ required: true, message: '请输入违章编号' }],
          },
        },
        truck: {
          title: '违规车辆',
          type: 'table-select',
          column: { show: false },
          dict: dict({
            getNodesByValues: async (values: any[]) => {
              return defHttp.get('/tms/trucks/dict-list', { params: values });
            },
          }),
          form: {
            valueBuilder({ form, key }) {
              form[key] = { label: form.plateNo, value: form.truckId };
            },
            valueChange: ({ value, form }) => {
              form.truckId = value.value;
              form.plateNo = value.label;
            },
            component: {
              valueType: 'object',
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
            rules: [{ required: true, message: '请选择违规车辆' }],
          },
        },
        truckId: {
          title: '车辆ID',
          type: 'text',
          column: { show: false },
          form: {
            show: false,
          },
        },
        plateNo: {
          title: '车牌号',
          type: 'text',
          column: { width: 150 },
          search: { show: true },
          form: {
            show: false,
          },
        },
        driverId: {
          title: '违章司机',
          search: { show: true },
          column: { ellipsis: true, width: 160 },
          type: 'table-select',
          dict: dict({
            getNodesByValues: async (values: any[]) => {
              return defHttp.get('/tms/drivers/dict-list', { params: values });
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
              createCrudOptions: driverCrudOptionsText,
              crudOptionsOverride: {
                rowHandle: { show: false },
                toolbar: { show: false },
                actionbar: { show: false },
                columns: {
                  idCardNo: { column: { show: false } },
                  enabled: { column: { show: false } },
                  idCardDateRange: { column: { show: false } },
                  remark: { column: { show: false } },
                  driverLicenseIssueOrg: { column: { show: false } },
                  adaptIdNo: { column: { show: false } },
                  createName: { column: { show: false } },
                  createTime: { column: { show: false } },
                },
              },
            },
            rules: [{ required: true, message: '请选择违章司机' }],
          },
        },
        peccancyItem: {
          title: '违章项目',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 200 },
          form: {
            rules: [{ required: true, message: '请输入违章项目' }],
          },
        },
        pointDeduction: {
          title: '扣分',
          type: 'number',
          search: { show: false },
          column: { ellipsis: true, width: 120 },
          form: {
            rules: [{ required: true, message: '请输入扣分' }],
          },
        },
        categoryCityName: {
          title: '违章地点',
          type: 'text',
          column: { show: false, width: 200 },
          form: {
            show: false,
          },
        },
        categoryCityId: {
          title: '违章地点',
          type: 'textarea',
          search: { show: false },
          column: { show: false },
          form: {
            rules: [{ required: true, message: '请输入违章地点' }],
            col: {
              span: 24,
            },
          },
        },
        fineAmount: {
          title: '罚款金额',
          type: 'number',
          search: { show: false },
          column: { ellipsis: true, width: 120 },
          form: {
            rules: [{ required: true, message: '请输入罚款金额' }],
          },
        },
        companyPayable: {
          title: '公司应付',
          type: 'number',
          search: { show: false },
          column: { ellipsis: true, width: 120 },
          form: {
            rules: [{ required: true, message: '请输入公司应付' }],
          },
        },
        driverPayable: {
          title: '司机应付',
          type: 'number',
          search: { show: false },
          column: { ellipsis: true, width: 120 },
          form: {
            rules: [{ required: true, message: '请输入司机应付' }],
          },
        },
        peccancyDate: {
          title: '违章日期',
          type: 'date',
          search: { show: true },
          column: { ellipsis: true, width: 180 },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD',
            },
            rules: [{ required: true, message: '请选择违章日期' }],
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).format('YYYY-MM-DD');
            }
          },
        },
        expenseDate: {
          title: '费用日期',
          type: 'date',
          search: { show: false },
          column: { ellipsis: true, width: 180 },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD',
            },
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).format('YYYY-MM-DD');
            }
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
        agentName: {
          title: '经办人',
          type: 'text',
          search: { show: false },
          column: { ellipsis: true, width: 180 },
          form: {
            rules: [{ required: true, message: '经办人不能为空' }],
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
