import type {
  AddReq,
  DelReq,
  EditReq,
  InfoReq,
  UserPageQuery,
  ValueBuilderContext,
} from '@fast-crud/fast-crud';

import { dict, utils } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import * as api from './api';
// import { GetGlobPreviewUrl } from "@/api/sysPrefix";
export default function crud() {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery) => await api.PageList(query),
        infoRequest: async ({ mode, row }: InfoReq) => {
          if (mode !== 'add') {
            return await api.GetInfo(row.id);
          }
          return row;
        },
        addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        editRequest: async ({ form }: EditReq) => await api.UpdateObj(form),
        delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
      },
      toolbar: {},
      search: {
        container: {
          // layout: "multi-line",
          action: {
            label: '操作',
            // col: { span: 4 }
          },
        },
        // options: {
        //   labelCol: {
        //     style: {
        //       width: "100px",
        //     },
        //   },
        // },
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
        orderNo: {
          title: '订单单号',
          type: 'text',
          column: { width: 180 },
          search: { show: true, order: 0 },
          addForm: { show: false },
          editForm: { show: false },
        },
        customNo: {
          title: '客户单号',
          type: 'text',
          column: { width: 180 },
          search: { show: false },
          form: {
            rules: [{ required: true, message: '客户单号不能为空' }],
          },
        },
        waybillNo: {
          title: '运输单号',
          type: 'text',
          column: { width: 180 },
          search: { show: true },
          form: {
            rules: [{ required: true, message: '运输单号不能为空' }],
          },
        },
        projectId: {
          title: '项目',
          type: 'dict-select',
          search: { show: true },
          column: { width: 180, component: { color: 'auto' } },
          dict: dict({
            url: '/iam/tenant-dict/TMS_PROJECT/list',
          }),
          form: {
            rules: [{ required: true, message: '请选择关联项目' }],
          },
        },
        transportType: {
          title: '运输方式',
          type: 'dict-select',
          search: { show: true },
          column: { width: 130, component: { color: 'auto' } },
          dict: dict({
            url: '/iam/tenant-dict/TMS_TRANSPORT_TYPE/list',
          }),
          form: {
            rules: [{ required: true, message: '请选择运输方式' }],
          },
        },
        quantity: {
          title: '数量',
          type: 'number',
          column: { width: 120 },
          search: { show: false },
          form: {
            rules: [{ required: true, message: '数量不能为空' }],
          },
        },
        qtyUnit: {
          title: '单位',
          type: 'dict-select',
          column: { width: 100, component: { color: 'auto' } },
          dict: dict({
            data: [
              { value: '1', label: '箱' },
              { value: '2', label: '件' },
              { value: '3', label: '套' },
            ],
          }),
          form: {
            rules: [{ required: true, message: '单位不能为空' }],
          },
        },
        grossWeight: {
          title: '毛重',
          type: 'number',
          column: { width: 200 },
          search: { show: false },
          form: { component: { min: 0, max: 99_999_999 } },
        },
        volume: {
          title: '体积',
          type: 'number',
          column: { width: 120 },
          search: { show: false },
          form: { component: { min: 0, max: 99_999_999 } },
        },
        declareValue: {
          title: '声明价值',
          type: 'number',
          column: { width: 200 },
          search: { show: false },
          form: { component: { min: 0, max: 99_999_999 } },
        },
        etd: {
          title: '预计发货',
          type: 'datetime',
          column: { width: 200 },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
            },
          },
          valueResolve({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).unix();
            }
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
        atd: {
          title: '实际发货',
          type: 'datetime',
          column: { width: 200, show: false },
          search: { show: false },
          addForm: { show: false },
          editForm: { show: false },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
            },
          },
        },
        eta: {
          title: '预计到达',
          type: 'datetime',
          column: { width: 200 },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
            },
          },
          valueResolve({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).unix();
            }
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
        ata: {
          title: '实际到达',
          type: 'datetime',
          column: { width: 200, show: false },
          search: { show: false },
          addForm: { show: false },
          editForm: { show: false },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
            },
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
        pickTime: {
          title: '提货时间',
          type: 'datetime',
          column: { width: 180 },
          search: { show: false },
          addForm: { show: false },
          editForm: { show: false },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
            },
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
          valueResolve({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).unix();
            }
          },
        },
        podTime: {
          title: '签收时间',
          type: 'datetime',
          column: { width: 180 },
          search: { show: false },
          addForm: { show: false },
          editForm: { show: false },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
            },
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
          valueResolve({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).unix();
            }
          },
        },
        cargoDesc: {
          title: '货物信息',
          type: ['textarea'],
          column: { ellipsis: true, width: 300 },
          search: { show: false },
          form: {
            col: {
              span: 24,
            },
            rules: [{ required: true, message: '货物信息不能为空' }],
          },
        },
        orderStatus: {
          title: '订单状态',
          type: 'dict-select',
          column: { width: 120, component: { color: 'auto' } },
          form: {
            component: {
              mode: 'multiple',
              showSearch: true,
            },
          },
          search: { show: true },
          addForm: { show: false },
          editForm: { show: false },
          dict: dict({
            data: [
              { value: '0', label: '新建' },
              { value: '10', label: '提货' },
              { value: '20', label: '到达始发站' },
            ],
          }),
        },
        /* latestEventType: {
          title: "最后一个节点类型",
          type: "number",
          column: { show: false, width: 150 },
          addForm: { show: false },
          editForm: { show: false },
        },
        latestEventId: {
          title: "最后一个节点ID",
          type: "number",
          column: { show: false, width: 150 },
          addForm: { show: false },
          editForm: { show: false },
        },
        transportLineId: {
          title: "运输线路ID",
          type: "text",
          column: { show: false, width: 100 },
          addForm: { show: false },
          editForm: { show: false },
        },*/
        hasEpod: {
          title: '电子回单',
          type: 'dict-radio',
          column: { width: 100 },
          search: { show: true },
          addForm: { value: false },
          dict: dict({
            data: [
              { value: true, label: '有', color: 'success' },
              { value: false, label: '无', color: 'error' },
            ],
          }),
        },
        sourceType: {
          title: '数据来源',
          type: 'dict-select',
          column: { width: 100 },
          search: { show: true },
          addForm: { show: false },
          editForm: { show: false },
          dict: dict({
            data: [
              { value: 1, label: '平台', color: 'success' },
              { value: 2, label: '小程序', color: 'error' },
            ],
          }),
        },
        remark: {
          title: '订单备注',
          type: 'textarea',
          column: { show: false },
          form: {
            col: {
              span: 24,
            },
          },
        },

        'senderInfo.name': {
          title: '客户名称',
          type: 'text',
          column: { show: false },
          form: {
            rules: [{ required: true, message: '客户名称不能为空' }],
          },
        },
        'senderInfo.phone': {
          title: '电话',
          type: 'text',
          column: { show: false },
        },
        'senderInfo.mobile': {
          title: '手机号',
          type: 'text',
          column: { show: false },
        },
        'senderInfo.area': {
          title: '发货地址',
          column: { width: 200, show: false },
          search: { show: false },
          type: 'dict-cascader',
          valueResolve({ form }: ValueBuilderContext): void {
            if (
              form.senderInfo.area !== null &&
              !utils.strings.hasEmpty(form.senderInfo.area)
            ) {
              form.senderInfo.provinceId = form.senderInfo.area[0];
              form.senderInfo.cityId = form.senderInfo.area[1];
              form.senderInfo.districtId = form.senderInfo.area[2];
            } else {
              form.senderInfo.provinceId = null;
              form.senderInfo.cityId = null;
              form.senderInfo.districtId = null;
            }
          },
          dict: dict({
            cache: true,
            isTree: true,
            url: '/iam/areas/trees',
            value: 'id',
            label: 'name',
          }),
          form: {
            valueBuilder({ row, form }: ValueBuilderContext): void {
              if (!utils.strings.hasEmpty(row.senderInfo?.provinceId)) {
                form.senderInfo.area = [
                  row.senderInfo.provinceId,
                  row.senderInfo.cityId,
                  row.senderInfo.districtId,
                ];
              }
            },
            component: {
              changeOnSelect: true,
              placeholder: '请选择地址',
              vModel: 'value',
              // 这种异步方式比用 dict 打开页面要快，体验要好点 但是存在的问题就是 column 没值
              showSearch: {
                filter: (inputValue, path) => {
                  return path.some((option) =>
                    option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase()),
                  );
                },
              },
            },
          },
        },
        'senderInfo.address': {
          title: '地址',
          type: 'textarea',
          column: { show: false },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: '地址不能为空' }],
          },
        },

        'receiverInfo.name': {
          title: '客户名称',
          type: 'text',
          column: { show: false },
          form: {
            rules: [{ required: true, message: '客户名称不能为空' }],
          },
        },
        'receiverInfo.phone': {
          title: '电话',
          type: 'text',
          column: { show: false },
        },
        'receiverInfo.mobile': {
          title: '手机号',
          type: 'text',
          column: { show: false },
        },

        'receiverInfo.area': {
          title: '收货地址',
          column: { width: 200, show: false },
          search: { show: false },
          type: 'dict-cascader',
          valueResolve({ form }: ValueBuilderContext): void {
            if (
              form.receiverInfo.area !== null &&
              !utils.strings.hasEmpty(form.receiverInfo.area)
            ) {
              form.receiverInfo.provinceId = form.receiverInfo.area[0];
              form.receiverInfo.cityId = form.receiverInfo.area[1];
              form.receiverInfo.districtId = form.receiverInfo.area[2];
            } else {
              form.receiverInfo.provinceId = null;
              form.receiverInfo.cityId = null;
              form.receiverInfo.districtId = null;
            }
          },
          dict: dict({
            cache: true,
            isTree: true,
            url: '/iam/areas/trees',
            value: 'id',
            label: 'name',
          }),
          form: {
            valueBuilder({ row, form }: ValueBuilderContext): void {
              if (!utils.strings.hasEmpty(row.receiverInfo?.provinceId)) {
                form.receiverInfo.area = [
                  row.receiverInfo.provinceId,
                  row.receiverInfo.cityId,
                  row.receiverInfo.districtId,
                ];
              }
            },
            component: {
              changeOnSelect: true,
              placeholder: '请选择地址',
              vModel: 'value',
              // 这种异步方式比用 dict 打开页面要快，体验要好点 但是存在的问题就是 column 没值
              showSearch: {
                filter: (inputValue, path) => {
                  return path.some((option) =>
                    option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase()),
                  );
                },
              },
            },
          },
        },
        'receiverInfo.address': {
          title: '地址',
          type: 'textarea',
          column: { show: false },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: '地址不能为空' }],
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
        attachment: {
          title: '附件',
          type: 'file-uploader',
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
          },
        },
      },
      form: {
        group: {
          groupType: 'tabs',
          accordion: false,
          groups: {
            senderInfo: {
              tab: '发货信息',
              columns: [
                'senderInfo.name',
                'senderInfo.phone',
                'senderInfo.mobile',
                'senderInfo.area',
                'senderInfo.address',
              ],
            },
            receiverInfo: {
              tab: '收货信息',
              columns: [
                'receiverInfo.name',
                'receiverInfo.phone',
                'receiverInfo.mobile',
                'receiverInfo.area',
                'receiverInfo.address',
              ],
            },
            otherInfo: {
              tab: '其它信息',
              columns: ['attachment'],
            },
          },
        },
      },
    },
  };
}
