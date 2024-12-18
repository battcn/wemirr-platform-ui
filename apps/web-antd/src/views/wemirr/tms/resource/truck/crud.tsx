import { compute, dict } from '@fast-crud/fast-crud';
import { Modal, notification } from 'ant-design-vue';
import dayjs from 'dayjs';

import { BusinessDictCode, businessDictFunc } from '#/api';

import * as api from './api';
// import { useMessage } from "@/hooks/web/useMessage";
// import { useI18n } from "@/hooks/web/useI18n";
// import { GetGlobPreviewUrl } from "@/api/sysPrefix";
import { defHttp } from '#/api/request';

import fleetCrudOptionsText from '../fleet/crud';

export default function () {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) => await api.PageList(query),
        addRequest: async ({ form }) => await api.AddObj(form),
        editRequest: async ({ form }) => await api.UpdateObj(form),
        delRequest: async ({ row }) => await api.DelObj(row.id),
      },
      toolbar: {},
      search: {},
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
        plateNo: {
          title: '车牌号',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 160 },
          form: {
            rules: [
              { required: true, message: '请输入车牌号' },
              {
                pattern: /^[\u4E00-\u9FA5][A-Z][A-Z_0-9]{5}$/,
                message: '车牌号格式错误',
              },
            ],
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
                content: `确定${row.enabled ? '启用' : '禁用'}吗`,
                onOk: () => {
                  defHttp
                    .put(`/tms/vehicles/${row.id}/enabled/${row.enabled}`)
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
          },
        },
        isExternal: {
          title: '是否外协',
          type: 'dict-radio',
          search: { show: false },
          column: { ellipsis: false, width: 150 },
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
          form: {
            col: { span: 12 },
          },
          addForm: {
            value: false,
          },
        },
        truckModelDetail: {
          title: '车型',
          type: 'text',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
          form: {
            show: false,
          },
          valueBuilder({ value, row, key }: any) {
            row[key] = `${row.truckModel || '-'}/${row.truckLength || '-'}/${
              row.truckWidth || '-'
            }`;
          },
        },
        truckModel: {
          title: '车型',
          type: 'text',
          search: { show: false },
          column: { show: false, width: 170 },
          form: {
            col: { span: 12 },
          },
        },
        truckLength: {
          title: '车长',
          type: 'decimal',
          search: { show: false },
          column: { show: false },
          form: {
            col: { span: 12 },
          },
        },
        truckWidth: {
          title: '车宽',
          type: 'text',
          search: { show: false },
          column: { show: false },
          form: {
            col: { span: 12 },
          },
        },
        energyType: {
          title: '能源类型',
          type: 'dict-select',
          dict: businessDictFunc(BusinessDictCode.TMS_ENERGY_TYPE),
          search: { show: true },
          column: {
            ellipsis: true,
            width: 200,
            component: {
              color: 'auto',
            },
          },
          form: {
            rules: [{ required: true, message: '请选择能源类型' }],
            col: { span: 12 },
          },
        },
        tiresCount: {
          title: '轮胎数量',
          type: 'number',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
          form: {
            col: { span: 12 },
          },
        },
        axlesCount: {
          title: '轴数',
          type: 'number',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
          form: {
            col: { span: 12 },
          },
        },
        fileDriverAndVehicle: {
          title: '人车合照',
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
          title: '其它文件',
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
        fileRoadCertificate: {
          title: '道路运输证',
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
        fileNo: {
          title: '档案编号',
          type: 'text',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
          form: {
            col: { span: 12 },
          },
        },
        plateColor: {
          title: '车牌颜色',
          type: 'dict-select',
          dict: businessDictFunc(BusinessDictCode.TMS_PLATE_COLOR),
          search: { show: false },
          column: { ellipsis: true, width: 200 },
          form: {
            col: { span: 12 },
          },
        },
        usageType: {
          title: '使用性质',
          type: 'text',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
          form: {
            rules: [{ required: true, message: '请输入使用性质' }],
            col: { span: 12 },
          },
        },
        brand: {
          title: '品牌',
          type: 'text',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
          form: {
            col: { span: 12 },
          },
        },
        truckCode: {
          title: '识别代码',
          type: 'text',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
          form: {
            col: { span: 12 },
          },
        },
        engineCode: {
          title: '发动机号码',
          type: 'text',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
          form: {
            col: { span: 12 },
          },
        },
        approvedPassenger: {
          title: '核定载客数',
          type: 'number',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
        },
        totalWeight: {
          title: '总质量',
          type: 'number',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
        },
        curbWeight: {
          title: '整备质量',
          type: 'number',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
        },
        approvedWeight: {
          title: '核定载重',
          type: 'number',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
        },
        towWeight: {
          title: '牵引质量',
          type: 'number',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
        },
        scrapDate: {
          title: '报废日期',
          type: 'date',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD',
            },
          },
          valueBuilder({ value, row, key }: any) {
            if (value != null) {
              row[key] = dayjs(value).format('YYYY-MM-DD');
            }
          },
        },
        roadCertificateCode: {
          title: '道路运输号',
          type: 'text',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
        },
        ownerName: {
          title: '拥有人',
          type: 'text',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
        },
        ownerIdCardNo: {
          title: '拥有证件号',
          type: 'text',
          search: { show: false },
          column: { ellipsis: true, width: 200 },
        },
        isAffiliation: {
          title: '是否挂靠',
          type: 'dict-radio',
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
          column: {
            width: 200,
          },
          addForm: {
            value: false,
          },
        },
        subordination: {
          title: '挂靠单位',
          type: 'text',
          search: { show: false },
          column: { show: false },
          form: {
            rules: [{ required: true, message: '请输入挂靠单位' }],
            col: { span: 12 },
            labelCol: { span: 6 },
            show: compute(({ form }) => {
              return form.isAffiliation;
            }),
          },
        },
        defaultDriverId: {
          title: '默认司机ID',
          type: 'text',
          search: { show: false },
          column: { show: false, width: 200 },
          form: {
            show: false,
            col: { span: 12 },
          },
        },
        fleetId: {
          title: '车队',
          column: { ellipsis: true, width: 200 },
          type: 'table-select',
          dict: dict({
            getNodesByValues: async (values: any[]) => {
              return await defHttp
                .get('/tms/fleets/dict_list', { params: values })
                .then((ret) => ret.data);
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
              createCrudOptions: fleetCrudOptionsText,
              crudOptionsOverride: {
                container: {
                  is: 'fs-layout-default',
                },
                rowHandle: { show: false },
                toolbar: { show: false },
                actionbar: { show: false },
                columns: {
                  remark: { column: { show: false } },
                },
              },
            },
          },
        },
        trailerId: {
          title: '挂车ID',
          type: 'text',
          column: { show: false },
          form: {
            show: false,
            col: { span: 12 },
          },
        },
        remark: {
          title: '备注',
          type: ['textarea'],
          column: { ellipsis: true, show: false },
          form: {
            col: { span: 24 },
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
      form: {
        group: {
          type: 'collapse',
          accordion: false,
          groups: {
            basicInfo: {
              header: '基础信息',
              columns: [
                'plateNo',
                'plateColor',
                'usageType',
                'energyType',
                'brand',
                'defaultDriverId',
                'fleetId',
                'truckModel',
                'truckLength',
                'truckWidth',
                'tiresCount',
                'axlesCount',
                'isExternal',
              ],
            },
            fileInfo: {
              header: '文件信息',
              columns: [
                'fileDriverAndVehicle',
                'fileRoadCertificate',
                'fileOther',
              ],
            },
            adaptInfo: {
              header: '其它信息',
              columns: [
                'fileNo',
                'truckCode',
                'engineCode',
                'approvedPassenger',
                'totalWeight',
                'curbWeight',
                'approvedWeight',
                'towWeight',
                'scrapDate',
                'roadCertificateCode',
                'ownerName',
                'ownerIdCardNo',
                'isAffiliation',
                'subordination',
                'remark',
              ],
            },
          },
        },
      },
    },
  };
}
