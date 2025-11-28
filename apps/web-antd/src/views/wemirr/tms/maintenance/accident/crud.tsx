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
      search: {
        // col: { span: 4 }
      },
      form: {
        wrapper: {
          // is: "a-modal",
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
        accidentNo: {
          title: '事故编号',
          type: 'text',
          search: { show: true },
          column: { width: 170 },
          form: {
            show: false,
          },
        },
        truckId: {
          title: '车辆',
          column: { width: 190 },
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
              createCrudOptions: truckCrudOptionsText,
              crudOptionsOverride: {
                rowHandle: { show: false },
                toolbar: { show: false },
                actionbar: { show: false },
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
            },
            rules: [{ required: true, message: '请选择车辆' }],
          },
        },
        driverId: {
          title: '司机',
          column: { width: 190 },
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
            rules: [{ required: true, message: '请选择司机' }],
          },
        },
        address: {
          title: '事故地点',
          type: 'textarea',
          column: { width: 200 },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: '请详细填写事故地点信息' }],
          },
        },
        responsibleParty: {
          title: '责任方',
          type: 'text',
          column: { width: 190 },
          form: {
            rules: [{ required: true, message: '责任方不能为空' }],
          },
        },
        accidentAmount: {
          title: '事故金额',
          type: 'number',
          column: { width: 190 },
          form: {
            rules: [{ required: true, message: '请输入事故金额' }],
          },
        },
        accidentDate: {
          title: '事故日期',
          type: 'date',
          column: { width: 190 },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD',
            },
            rules: [{ required: true, message: '事故日期不能为空' }],
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
          column: { width: 150 },
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
