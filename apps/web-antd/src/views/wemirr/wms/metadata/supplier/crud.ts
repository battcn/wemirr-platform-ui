import type {
  AddReq,
  DelReq,
  EditReq,
  UserPageQuery,
  ValueBuilderContext,
} from '@fast-crud/fast-crud';

import { dict, utils } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import * as api from './api';

export default function crud() {
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
          title: '编号',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160, fixed: 'left' },
          form: { show: false },
        },
        name: {
          title: '名称',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 200, fixed: 'left' },
          form: {
            rules: [{ required: true, message: '请输入供应商名称' }],
          },
        },
        creditCode: {
          title: '统一信用代码',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入统一信用代码' }],
          },
        },
        address: {
          title: '地址',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 200, ellipsis: true },
          form: {
            rules: [{ required: false, message: '请输入地址' }],
          },
        },
        legalPerson: {
          title: '法人',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入法定代表人' }],
          },
        },
        businessScope: {
          title: '经营范围',
          type: 'textarea',
          search: { show: false },
          column: { show: true, width: 160, ellipsis: true },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: '请输入经营范围' }],
          },
        },
        enterpriseType: {
          title: '企业类型',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 200, ellipsis: true },
          form: {
            // 表单配置
            rules: [{ required: false, message: '请输入企业类型' }],
          },
        },
        logo: {
          title: 'LOGO',
          type: 'cropper-uploader',
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
        tel: {
          title: '公司电话',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [{ required: false, message: '请输入公司电话' }],
          },
        },
        establishmentDate: {
          title: '成立日期',
          type: 'date',
          search: { show: false },
          column: { show: true, width: 160 },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
          valueResolve({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).format('YYYY-MM-DD');
            }
          },
          form: {
            component: { valueFormat: 'YYYY-MM-DD' },
            rules: [{ required: true, message: '请选择成立日期' }],
          },
        },
        businessStartDate: {
          title: '营业起始日期',
          type: 'date',
          search: { show: false },
          column: { show: true, width: 160 },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
          valueResolve({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).format('YYYY-MM-DD');
            }
          },
          form: {
            component: { valueFormat: 'YYYY-MM-DD' },
            rules: [{ required: true, message: '请选择营业期限开始日期' }],
          },
        },
        businessEndDate: {
          title: '营业截止日期',
          type: 'date',
          search: { show: false },
          column: { show: true, width: 160 },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
          valueResolve({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).format('YYYY-MM-DD');
            }
          },
          form: {
            component: { valueFormat: 'YYYY-MM-DD' },
            rules: [{ required: true, message: '请选择营业期限截止日期' }],
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
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
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
                selectedChange({ $event, key, form }) {
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
        registrationAuthority: {
          title: '登记机关',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [{ required: false, message: '请输入登记机关' }],
          },
        },
        contactName: {
          title: '联系人',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [{ required: false, message: '请输入联系人姓名' }],
          },
        },
        contactPhone: {
          title: '联系电话',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [{ required: false, message: '请输入联系电话' }],
          },
        },
        email: {
          title: '电子邮件',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [{ required: false, message: '请输入电子邮件' }],
          },
        },
        creditLimit: {
          title: '信用额度',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [{ required: false, message: '请输入信用额度' }],
          },
        },
        description: {
          title: '备注',
          type: 'textarea',
          column: { show: false, width: 160 },
          form: {
            col: { span: 24 },
            rules: [{ required: false, message: '请输入备注' }],
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
