import { compute, dict } from '@fast-crud/fast-crud';
import moment from 'moment';
import { GET, DELETE, POST, PUT } from '/src/api/service';

export default function ({ expose }) {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await GET(`/authority/tenants`, query),
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
          form: {
            rules: [{ required: true, message: '请选择租户类型' }],
          },
        },
        status: {
          title: '认证状态',
          search: { show: true },
          addForm: { value: 0 },
          column: { show: true, align: 'center', width: 80 }, // 表单配置
          type: 'dict-radio',
          dict: dict({
            data: [
              { value: 0, label: '未认证', color: 'warning' },
              { value: 1, label: '已认证', color: 'success' },
            ],
          }),
          form: {
            rules: [{ required: true, message: '请选择认证状态' }],
          },
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
          form: {
            rules: [{ required: true, message: '请选择使用状态' }],
          },
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
        area: {
          title: '地区',
          column: {
            show: false,
            component: { name: 'fs-values-format' },
          },
          // type: 'dict-cascader',
          // column: { show: false },
          // dict: dict({
          //   isTree: true,
          //   url: '/authority/areas/0/children',
          //   // url: '/authority/org/trees',
          //   value: 'id',
          //   label: 'name',
          // }),
          // dict: dict({
          //   url: `/authority/areas/0/children`,
          //   value: 'id',
          //   label: 'name',
          //   isTree: true,
          //   getNodes(values) {
          //     console.log('values', values);
          //     if (values == null) {
          //       return [];
          //     }
          //     return GET(`/authority/areas/${values}/children`);
          //   },
          // }),
          // form: {
          //   component: {
          //     vModel: 'value',
          //     options: ref([
          //       {
          //         value: 110000,
          //         label: '北京',
          //         isLeaf: false,
          //       },
          //       {
          //         value: 120000,
          //         label: '天津',
          //         isLeaf: false,
          //       },
          //     ]),
          //     loadData: async (selectedOptions) => {
          //       console.log('lazyLoad', selectedOptions);
          //       const targetOption = selectedOptions[selectedOptions.length - 1];
          //       console.log('targetOption', targetOption);
          //       targetOption.loading = true;
          //       const ret = await GET(`/authority/areas/${targetOption.value}/children`);
          //       // .then((ret) => {});
          //       console.log('ret=>>>', ret);
          //       targetOption.loading = false;
          //       targetOption.children = ret.data.map((item) => {
          //         return { value: item.id, label: item.name, isLeaf: false };
          //       });
          //       console.log('targetOption.children', targetOption.children);
          //       options.value = [...options.value];
          //     },
          //     changeOnSelect: true,
          //   },
          // },
        },
        provinceId: {
          title: '省',
          type: 'text',
          column: { ellipsis: true, show: false },
        },
        cityId: {
          title: '市',
          type: 'text',
          column: { ellipsis: true, show: false },
        },
        districtId: {
          title: '区',
          type: 'text',
          column: { ellipsis: true, show: false },
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
          title: '消息内容',
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
        display: 'flex',
        group: {
          type: 'collapse',
          accordion: false,
          groups: {
            baseInfo: {
              header: '基本信息',
              columns: ['name', 'alias', 'code', 'type', 'industry', 'status', 'locked'],
            },
            linkInfo: {
              header: '联系方式',
              columns: ['contactPerson', 'contactPhone', 'email'],
            },
            areaInfo: {
              header: '区域信息',
              columns: ['provinceId', 'cityId', 'districtId', 'address'],
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
