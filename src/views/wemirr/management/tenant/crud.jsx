import { compute, dict, utils, asyncCompute } from '@fast-crud/fast-crud';
import moment from 'moment';
import { GET, DELETE, POST, PUT } from '/src/api/service';

import { getAreaTree } from '/@/api/sys/area';

export default function ({ expose }) {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => {
          if (query.area) {
            query.provinceId = query?.area[0];
            query.cityId = query?.area[1];
            query.districtId = query?.area[2];
          }
          return await GET(`/authority/tenants`, query);
        },
        addRequest: async ({ form }) => await POST(`/authority/tenants`, form),
        editRequest: async ({ form }) => await PUT(`/authority/tenants/${form.id}`, form),
        delRequest: async ({ row }) => await DELETE(`/authority/tenants/${row.id}`),
      },
      rowHandle: { fixed: 'right' },
      table: {
        scroll: {
          //需要设置它，否则滚动条拖动时，表头不会动
          fixed: true,
          x: 1400,
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        name: {
          title: '名称',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 200 },
          form: {
            rules: [
              { required: true, message: '请输入名称' },
              { min: 2, max: 30, message: '长度在 2 到 30 个字符' },
            ],
          },
        },
        code: {
          title: '编码',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 90 },
          form: {
            rules: [
              { required: true, message: '请输入编码' },
              { min: 4, max: 6, message: '长度在 4 到 6 个字符' },
            ],
          },
        },
        alias: {
          title: '简称',
          type: 'text',
          column: { width: 100 },
          form: {
            rules: [{ min: 2, max: 8, message: '长度在 2 到 8 个字符' }],
          },
        },
        contactPerson: {
          title: '联系人',
          type: 'text',
          column: { show: true, width: 120 },
          form: {
            rules: [{ min: 2, max: 30, message: '长度在 2 到 30 个字符' }],
          },
        },
        contactPhone: {
          title: '联系方式',
          type: 'text',
          column: { show: true, width: 150 },
          form: {
            rules: [{ min: 2, max: 30, message: '长度在 2 到 30 个字符' }],
          },
        },
        type: {
          title: '类型',
          search: { show: true },
          column: { show: true, align: 'center', width: 80 }, // 表单配置
          type: 'dict-radio',
          addForm: { value: 0 },
          dict: dict({
            data: [
              { value: 0, label: '其它', color: 'warning' },
              { value: 1, label: '企业', color: 'success' },
            ],
          }),
        },
        status: {
          title: '认证状态',
          search: { show: true },
          addForm: { value: 0 },
          column: { show: true, align: 'center', width: 80 }, // 表单配置
          type: ['dict-radio'],
          dict: dict({
            data: [
              { value: 0, label: '未认证', color: 'warning' },
              { value: 1, label: '已认证', color: 'success' },
            ],
          }),
        },
        locked: {
          title: '使用状态',
          addForm: { value: false },
          column: { show: true, align: 'center', width: 80 },
          type: 'dict-radio',
          dict: dict({
            data: [
              { value: false, label: '启用', color: 'success' },
              { value: true, label: '禁用', color: 'error' },
            ],
          }),
        },
        email: {
          title: '邮箱',
          type: 'text',
          column: { show: false, width: 200 },
          form: {
            rules: [{ min: 2, max: 30, message: '长度在 2 到 30 个字符' }],
          },
        },
        industry: {
          title: '行业',
          column: { show: true, width: 150 },
          type: 'dict-select',
          dict: dict({
            url: '/authority/dictionaries/INDUSTRY/list',
          }),
        },
        // 目的是为了用户体验更好,打开弹窗和进入页面更快速
        areaText: {
          title: '地区',
          column: { width: 200 },
          form: { show: false },
          type: 'text',
          valueBuilder({ row, key }) {
            if (!utils.strings.hasEmpty(row.provinceName)) {
              row[key] = row.provinceName;
            }
            if (!utils.strings.hasEmpty(row.cityName)) {
              row[key] = row.provinceName + ' / ' + row.cityName;
            }
            if (!utils.strings.hasEmpty(row.districtName)) {
              row[key] = row.provinceName + ' / ' + row.cityName + ' / ' + row.districtName;
            }
          },
        },
        area: {
          title: '地区',
          column: { width: 200, show: false },
          search: { show: true },
          type: 'dict-cascader',
          valueBuilder({ row, key }) {
            if (!utils.strings.hasEmpty(row.provinceId)) {
              row[key] = [row.provinceId, row.cityId, row.districtId];
            }
          },
          valueResolve({ form, key }) {
            const row = form;
            if (row[key] != null && !utils.strings.hasEmpty(row[key])) {
              row.provinceId = row[key][0];
              row.cityId = row[key][1];
              row.districtId = row[key][2];
            } else {
              row.provinceId = null;
              row.cityId = null;
              row.districtId = null;
            }
          },
          // dict: dict({
          //   cache: true,
          //   isTree: true,
          //   url: '/authority/areas/trees',
          //   value: 'id',
          //   label: 'name',
          // }),
          form: {
            component: {
              changeOnSelect: true,
              placeholder: '请选择地址',
              vModel: 'value',
              // 这种异步方式比用 dict 打开页面要快，体验要好点 但是存在的问题就是 column 没值
              options: asyncCompute({
                asyncFn: async () => {
                  return await getAreaTree();
                },
              }),
              showSearch: {
                filter: (inputValue, path) => {
                  return path.some(
                    (option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                  );
                },
              },
            },
          },
        },
        address: {
          title: '地址',
          type: ['textarea', 'colspan'],
          column: { ellipsis: true, show: false },
        },
        creditCode: {
          title: '信用代码',
          type: 'text',
          column: { ellipsis: true, show: false },
          form: {
            show: compute(({ row }) => {
              return row?.type === 1;
            }),
          },
        },
        legalPersonName: {
          title: '法人',
          type: 'text',
          column: { ellipsis: true, show: false },
          form: {
            show: compute(({ row }) => {
              return row?.type === 1;
            }),
          },
        },
        webSite: {
          title: '租户网址',
          type: ['textarea', 'colspan'],
          column: { ellipsis: true, show: false },
        },
        description: {
          title: '描述信息',
          type: ['textarea', 'colspan'],
          column: { ellipsis: true, show: false },
        },
        logo: {
          title: '头像',
          type: 'cropper-uploader',
          style: { height: 70 },
          column: { width: 70, align: 'center', show: false },
          valueBuilder({ value, row, key }) {
            if (value != null && value.indexOf('http')) {
              row[key] = 'http://www.docmirror.cn:7070' + value;
            }
          },
          form: {
            component: {
              uploader: {
                type: 'form', // 上传后端类型【cos,aliyun,oss,form】
                buildUrl(res) {
                  return 'http://www.docmirror.cn:7070/' + res.url;
                },
              },
            },
          },
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          form: { show: false },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = moment(value);
            }
          },
        },
      },
      form: {
        group: {
          type: 'collapse',
          accordion: false,
          groups: {
            baseInfo: {
              header: '基本信息',
              columns: ['name', 'alias', 'code', 'industry', 'type', 'status', 'locked'],
            },
            linkInfo: {
              header: '联系方式',
              columns: ['contactPerson', 'contactPhone', 'email'],
            },
            areaInfo: {
              header: '区域信息',
              columns: ['area', 'address'],
            },
            otherInfo: {
              header: '其它信息',
              collapsed: true,
              columns: ['creditCode', 'legalPersonName', 'webSite', 'description', 'logo'],
            },
          },
        },
      },
    },
  };
}
