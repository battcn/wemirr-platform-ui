import type {
  AddReq,
  DelReq,
  EditReq,
  UserPageQuery,
  ValueBuilderContext,
} from '@fast-crud/fast-crud';

import { dict, utils } from '@fast-crud/fast-crud';

import { SysDictCode, sysDictFunc } from '#/api';

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
          title: '编码',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 120, fixed: 'left' },
          addForm: { show: false },
          editForm: { show: false },
        },
        name: {
          title: '名称',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 130, fixed: 'left' },
          form: {
            rules: [{ required: true, message: '请输入品牌名称' }],
          },
        },
        contactPerson: {
          title: '联系人',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入品牌联系人' }],
          },
        },
        contactPhone: {
          title: '联系方式',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入品牌联系人联系方式' }],
          },
        },
        company: {
          title: '公司',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入品牌公司' }],
          },
        },
        owner: {
          title: '所有者',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入品牌所有者' }],
          },
        },
        email: {
          title: '邮箱',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入品牌邮箱' }],
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
        status: {
          title: '状态',
          search: { show: true },
          column: { width: 100, component: { color: 'auto' } },
          type: 'dict-select',
          dict: sysDictFunc(SysDictCode.STATUS),
          form: {
            rules: [{ required: true, message: '请选择状态' }],
          },
        },
        type: {
          title: '类型',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入品牌类型' }],
          },
        },
        // 目的是为了用户体验更好,打开弹窗和进入页面更快速
        areaText: {
          title: '地区',
          column: { width: 200, show: true },
          form: { show: false },
          type: 'text',
          valueBuilder({ row }: ValueBuilderContext) {
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
                selectedChange({ $event, key, form }: any) {
                  if (
                    form[key] !== null &&
                    !utils.strings.hasEmpty(form[key])
                  ) {
                    form.provinceId = $event[0]?.value;
                    form.provinceName = $event[0]?.label;
                    form.cityId = $event[1]?.value;
                    form.cityName = $event[1]?.label;
                    form.districtId = $event[2]?.value;
                    form.districtName = $event[2]?.label;
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
          title: '地址',
          type: ['textarea'],
          column: { ellipsis: true, show: false },
          form: {
            col: { span: 24 },
          },
        },
        website: {
          title: '网址',
          type: 'textarea',
          column: { show: false, width: 160 },
          form: {
            col: { span: 24 },
            rules: [{ required: false, message: '请输入品牌网址' }],
          },
        },
        description: {
          title: '描述',
          type: 'textarea',
          column: { show: true, width: 160, ellipsis: true },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: '请输入品牌名称' }],
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
