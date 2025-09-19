import type {
  AddReq,
  DelReq,
  EditReq,
  UserPageQuery,
} from '@fast-crud/fast-crud';

import { dict, utils } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import * as api from './api';

// 承运商类型
const carrierTypeDict = [
  { value: 'TRADE_OUT', label: '外贸' },
  { value: 'TRADE_IN', label: '内贸' },
];
// 服务类型
const serviceTypeDict = [
  { value: 'LAND', label: '陆运' },
  { value: 'SEA', label: '海运' },
  { value: 'AIR', label: '空运' },
];

export default function crud({ crudExpose }) {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery) => await api.GetList(query),
        addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        editRequest: async ({ form }: EditReq) => await api.UpdateObj(form),
        delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {},
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        code: {
          title: '编码',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 120, fixed: 'left' },
          form: { show: false },
        },
        name: {
          title: '名称',
          type: 'textarea',
          search: { show: true },
          column: { show: true, width: 200, fixed: 'left' },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: '请输入承运商名称' }],
          },
        },
        type: {
          title: '类型',
          type: 'dict-select',
          column: { show: true, width: 100, component: { color: 'auto' } },
          form: {
            rules: [{ required: true, message: '请选择承运商类型' }],
          },
          dict: dict({
            data: carrierTypeDict,
          }),
        },
        serviceType: {
          title: '服务类型',
          type: 'dict-select',
          column: { show: true, width: 100, component: { color: 'auto' } },
          form: {
            rules: [{ required: true, message: '请选择服务类型' }],
          },
          dict: dict({
            data: serviceTypeDict,
          }),
        },
        dateRange: {
          title: '有效日期',
          type: 'daterange',
          search: { show: true, width: 300, col: { span: 6 } },
          valueBuilder({ row, key }: any) {
            if (
              !utils.strings.hasEmpty(row.effectiveDate, row.expirationDate)
            ) {
              row[key] = [dayjs(row.effectiveDate), dayjs(row.expirationDate)];
            }
          },
          valueResolve({ form, key }: any) {
            if (form[key] !== null && !utils.strings.hasEmpty(form[key])) {
              form.effectiveDate = dayjs(form[key][0]).unix();
              form.expirationDate = dayjs(form[key][1]).unix();
            } else {
              form.effectiveDate = null;
              form.expirationDate = null;
            }
          },
        },
        effectiveDate: {
          title: '生效日期',
          type: 'date',
          column: { show: false, width: 160 },
          form: { show: false },
        },
        expirationDate: {
          title: '失效日期',
          type: 'date',
          column: { show: false, width: 160 },
          form: { show: false },
        },
        settlementType: {
          title: '结算方式',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {},
        },
        postcode: {
          title: '邮编',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {},
        },
        contactName: {
          title: '联系人',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入品牌联系人' }],
          },
        },
        mobile: {
          title: '联系人手机号',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入联系人手机号' }],
          },
        },
        email: {
          title: '邮箱',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {},
        },
        fax: {
          title: '传真',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {},
        },
        attachment: {
          title: '附件',
          type: 'file-uploader',
          style: { height: 70 },
          column: { width: 70, align: 'center', show: false },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null && value.indexOf('http')) {
              row[key] = `http://www.docmirror.cn:7070${value}`;
            }
          },
          form: {
            component: {
              uploader: {
                type: 'form', // 上传后端类型【cos,aliyun,oss,form】
                buildUrl(res) {
                  return `http://www.docmirror.cn:7070/${res.url}`;
                },
              },
            },
          },
        },
        description: {
          title: '备注',
          type: 'textarea',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            col: { span: 24 },
          },
        },
        // 目的是为了用户体验更好,打开弹窗和进入页面更快速
        areaText: {
          title: '地区',
          column: { width: 200, show: true },
          form: { show: false },
          type: 'text',
          valueBuilder({ row }) {
            if (!utils.strings.hasEmpty(row.provinceName)) {
              row.areaText = row.provinceName;
            }
            if (!utils.strings.hasEmpty(row.cityName)) {
              row.areaText = `${row.provinceName} / ${row.cityName}`;
            }
            if (!utils.strings.hasEmpty(row.districtName)) {
              row.areaText = `${row.provinceName} / ${row.cityName} / ${
                row.districtName
              }`;
            }
          },
        },
        area: {
          title: '地区',
          column: { width: 200, show: false },
          search: { show: false },
          type: 'dict-cascader',
          valueBuilder({ row, key }: any) {
            if (!utils.strings.hasEmpty(row.provinceId)) {
              row[key] = [row.provinceId, row.cityId, row.districtId];
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
            rules: [{ required: true, message: '地址不能为空' }],
            component: {
              changeOnSelect: true,
              placeholder: '请选择地址',
              vModel: 'value',
              on: {
                selectedChange({ $event, key, form }: any) {
                  if (
                    form[key] !== null &&
                    !utils.strings.hasEmpty(form[key])
                  ) {
                    form.provinceId = $event[0].value;
                    form.provinceName = $event[0].label;
                    form.cityId = $event[1].value;
                    form.cityName = $event[1].label;
                    form.districtId = $event[2].value;
                    form.districtName = $event[2].label;
                  } else {
                    form.provinceId = null;
                    form.provinceName = null;
                    form.cityId = null;
                    form.cityName = null;
                    form.districtId = null;
                    form.districtName = null;
                  }
                },
              },
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
        address: {
          title: '详细地址',
          type: ['textarea'],
          column: { ellipsis: true, show: false },
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
    },
  };
}
