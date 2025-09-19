import { dict, utils } from '@fast-crud/fast-crud';
import { Modal, notification } from 'ant-design-vue';
import dayjs from 'dayjs';

// import { useMessage } from "@/hooks/web/useMessage";
// import { useI18n } from "@/hooks/web/useI18n";
// import { GetGlobPreviewUrl } from "@/api/sysPrefix";
// import { formatToDate } from "@/utils/dateUtil";
import { defHttp } from '#/api/request';

import truckCrudOptionsText from '../truck/crud';
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
      actionbar: {
        show: true,
        buttons: {},
      },
      rowHandle: {
        width: 200,
        buttons: {},
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        realName: {
          title: '名称',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入司机姓名' }],
            col: { span: 12 },
          },
        },
        idCardNo: {
          title: '身份证',
          type: 'text',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
          form: {
            rules: [{ required: true, message: '请输入身份证' }],
            col: { span: 12 },
          },
        },
        mobile: {
          title: '手机号',
          type: 'text',
          column: { ellipsis: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入司机手机号' }],
            col: { span: 12 },
          },
        },
        enabled: {
          title: '状态',
          type: 'dict-switch',
          addForm: { value: true },
          column: {
            width: 100,
            align: 'center',
            component: {
              name: 'fs-dict-switch',
              vModel: 'checked',
            },
            valueChange: ({ value, row, record }) => {
              Modal.confirm({
                iconType: 'warning',
                title: '提示',
                content: `确定${row.status ? '启用' : '禁用'}吗`,
                onOk: () => {
                  defHttp
                    .put(`/tms/drivers/${row.id}/enabled/${row.enabled}`)
                    .then(() => {
                      notification.success({
                        message: row.enabled ? '启用成功' : '禁用成功',
                        duration: 2,
                      });
                    });
                },
                onCancel: () => {
                  record.enabled = !value;
                },
              });
            },
          },
          dict: dict({
            data: [
              { value: true, label: '启用', color: 'success' },
              { value: false, label: '禁用', color: 'warning' },
            ],
          }),
          form: {
            show: false,
            rules: [{ required: true, message: '状态不能为空' }],
          },
        },
        defaultTruckId: {
          title: '默认车辆',
          column: { show: false },
          type: 'table-select',
          dict: dict({
            getNodesByValues: async (values: any[]) => {
              return defHttp.get('/tms/trucks/dict_list', { params: values });
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
            rules: [{ required: true, message: '请选择车辆信息' }],
          },
        },
        idCardDateRange: {
          title: '身份证有效期',
          type: 'daterange',
          column: { show: true },
          search: { show: true, width: 300 },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (
              !utils.strings.hasEmpty(row.idCardStartDate, row.idCardEndDate)
            ) {
              row[key] = [dayjs(row.idCardStartDate), dayjs(row.idCardEndDate)];
            }
          },
          valueResolve({ form, key }) {
            const row = form;
            if (row[key] != null && !utils.strings.hasEmpty(row[key])) {
              // row.idCardStartDate = formatToDate(row[key][0]);
              // row.idCardEndDate = formatToDate(row[key][1]);
            } else {
              row.idCardStartDate = null;
              row.idCardEndDate = null;
            }
          },
          form: {
            col: { span: 12 },
          },
        },
        idCardStartDate: {
          title: '起始日期',
          type: 'date',
          column: { show: false },
          form: {
            show: false,
            col: { span: 12 },
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).format('YYYY-MM-DD');
            }
          },
        },
        idCardEndDate: {
          title: '结束日期',
          type: 'date',
          column: { show: false },
          form: {
            show: false,
            col: { span: 12 },
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).format('YYYY-MM-DD');
            }
          },
        },
        licenseCode: {
          title: '许可证',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 120 },
          form: {
            col: { span: 12 },
          },
        },
        licenseType: {
          title: '驾照类型',
          type: 'text',
          search: { show: false },
          column: { ellipsis: true, width: 120 },
        },
        driverLicenseRange: {
          title: '驾照有效期',
          type: 'daterange',
          search: { show: false, width: 300 },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (
              !utils.strings.hasEmpty(
                row.driverLicenseStart,
                row.driverLicenseEnd,
              )
            ) {
              row[key] = [
                dayjs(row.driverLicenseStart),
                dayjs(row.driverLicenseEnd),
              ];
            }
          },
          valueResolve({ form, key }) {
            const row = form;
            if (row[key] != null && !utils.strings.hasEmpty(row[key])) {
              // row.driverLicenseStart = formatToDate(row[key][0]);
              // row.driverLicenseEnd = formatToDate(row[key][1]);
            } else {
              row.driverLicenseStart = null;
              row.driverLicenseEnd = null;
            }
          },
          form: {
            col: { span: 12 },
          },
        },
        driverLicenseStart: {
          title: '驾照有效期',
          type: 'date',
          search: { show: false },
          column: { show: false },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).format('YYYY-MM-DD');
            }
          },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD',
            },
            show: false,
            col: { span: 12 },
          },
        },
        driverLicenseEnd: {
          title: '驾照有效期',
          type: 'date',
          column: { show: false },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).format('YYYY-MM-DD');
            }
          },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD',
            },
            show: false,
            col: { span: 12 },
          },
        },
        driverLicenseIssueOrg: {
          title: '驾照发放机构',
          type: 'text',
          column: { ellipsis: true, width: 200 },
          form: {
            col: { span: 12 },
          },
        },
        driverType: {
          title: '驾驶员类型',
          type: 'text',
          column: { ellipsis: true, width: 200 },
          form: {
            col: { span: 12 },
          },
        },
        filePortraitId: {
          title: '驾照图像',
          type: 'avatar-uploader',
          column: { show: false },
          form: {
            component: {
              sizeLimit: 1024 * 1024 * 5,
              uploader: {
                type: 'form',
              },
              valueType: 'fileId',
              async buildUrl(value) {
                return new Promise((resolve) => {
                  // resolve(GetGlobPreviewUrl(value));
                });
              },
            },
            helper: '大小不能超过5M',
            col: { span: 12 },
          },
        },
        fileIdCardFront: {
          title: '身份证正面',
          type: 'avatar-uploader',
          column: { show: false },
          form: {
            component: {
              sizeLimit: 1024 * 1024 * 5,
              uploader: {
                type: 'form',
              },
              valueType: 'fileId',
              async buildUrl(value) {
                return new Promise((resolve) => {
                  // resolve(GetGlobPreviewUrl(value));
                });
              },
            },
            helper: '大小不能超过5M',
            col: { span: 12 },
          },
        },
        fileIdCardBack: {
          title: '身份证背面',
          type: 'avatar-uploader',
          column: { show: false },
          form: {
            component: {
              sizeLimit: 1024 * 1024 * 5,
              uploader: {
                type: 'form',
              },
              valueType: 'fileId',
              async buildUrl(value) {
                return new Promise((resolve) => {
                  // resolve(GetGlobPreviewUrl(value));
                });
              },
            },
            helper: '大小不能超过5M',
            col: { span: 12 },
          },
        },
        fileDriverLicense: {
          title: '驾照',
          type: 'avatar-uploader',
          column: { show: false },
          form: {
            component: {
              sizeLimit: 1024 * 1024 * 5,
              uploader: {
                type: 'form',
              },
              valueType: 'fileId',
              async buildUrl(value) {
                return new Promise((resolve) => {
                  // resolve(GetGlobPreviewUrl(value));
                });
              },
            },
            helper: '大小不能超过5M',
            col: { span: 12 },
          },
        },
        fileCertificate: {
          title: '许可证',
          type: 'avatar-uploader',
          column: { show: false },
          form: {
            component: {
              sizeLimit: 1024 * 1024 * 5,
              uploader: {
                type: 'form',
              },
              valueType: 'fileId',
              async buildUrl(value) {
                return new Promise((resolve) => {
                  // resolve(GetGlobPreviewUrl(value));
                });
              },
            },
            helper: '大小不能超过5M',
            col: { span: 12 },
          },
        },
        fileOther: {
          title: '其它',
          type: 'avatar-uploader',
          column: { show: false },
          form: {
            component: {
              sizeLimit: 1024 * 1024 * 5,
              uploader: {
                type: 'form',
              },
              valueType: 'fileId',
              async buildUrl(value) {
                return new Promise((resolve) => {
                  // resolve(GetGlobPreviewUrl(value));
                });
              },
            },
            helper: '大小不能超过5M',
            col: { span: 12 },
          },
        },
        adaptIdNo: {
          title: '从业资格证件号',
          type: 'text',
          column: { ellipsis: true, width: 200 },
          form: {
            col: { span: 12 },
          },
        },
        adaptIdDateRange: {
          title: '从业资格有效期',
          type: 'daterange',
          search: { show: false, width: 300 },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (
              !utils.strings.hasEmpty(row.adaptIdIssueDate, row.adaptIdDueDate)
            ) {
              row[key] = [
                dayjs(row.adaptIdIssueDate),
                dayjs(row.adaptIdDueDate),
              ];
            }
          },
          valueResolve({ form, key }) {
            const row = form;
            if (row[key] != null && !utils.strings.hasEmpty(row[key])) {
              // row.adaptIdIssueDate = formatToDate(row[key][0]);
              // row.adaptIdDueDate = formatToDate(row[key][1]);
            } else {
              row.adaptIdIssueDate = null;
              row.adaptIdDueDate = null;
            }
          },
          form: {
            col: { span: 12 },
          },
        },
        adaptIdIssueDate: {
          title: '从业资格证件发放日期',
          type: 'date',
          column: { show: false },
          form: {
            show: false,
            col: { span: 12 },
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
        adaptIdDueDate: {
          title: '从业资格证件有效期至',
          type: 'date',
          column: { show: false },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
        fileAdaptId: {
          title: '从业资格证件照片ID',
          type: 'avatar-uploader',
          column: { show: false },
        },
        remark: {
          title: '备注',
          type: 'textarea',
          column: { show: false },
          form: {
            col: { span: 24 },
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
      form: {
        group: {
          type: 'collapse',
          accordion: false,
          groups: {
            identityInfo: {
              header: '身份信息',
              columns: [
                'realName',
                'mobile',
                'idCardNo',
                'idCardStartDate',
                'idCardEndDate',
                'idCardDateRange',
                'defaultTruckId',
              ],
            },
            fileInfo: {
              header: '文件信息',
              columns: [
                'filePortraitId',
                'fileDriverLicense',
                'fileIdCardFront',
                'fileIdCardBack',
                'fileCertificate',
                'fileAdaptId',
                'fileOther',
              ],
            },
            licenseInfo: {
              header: '许可证信息',
              columns: [
                'licenseCode',
                'licenseType',
                'driverType',
                'driverLicenseIssueOrg',
                'driverLicenseRange',
                'driverLicenseStart',
                'driverLicenseEnd',
              ],
            },
            adaptInfo: {
              header: '调整信息',
              columns: [
                'adaptIdNo',
                'adaptIdIssueDate',
                'adaptIdDueDate',
                'adaptIdDateRange',
                'remark',
              ],
            },
          },
        },
      },
    },
  };
}
