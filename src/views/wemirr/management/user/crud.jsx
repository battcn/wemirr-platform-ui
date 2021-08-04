import { GET, POST, PUT, DELETE } from '/src/api/service';
import { compute, dict } from '@fast-crud/fast-crud';
import moment from 'moment';

export default function ({ expose }) {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await GET(`/authority/users`, query),
        addRequest: async ({ form }) => await POST(`/authority/users`, form),
        editRequest: async ({ form }) => await PUT(`/authority/users/${form.id}`, form),
        delRequest: async ({ row }) => await DELETE(`/authority/users/${row.id}`),
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
        username: {
          title: '账号',
          type: 'text',
          column: { width: 155 },
          search: { show: true, fixed: 'left' },
          form: {
            rules: [
              { required: true, message: '请输入账号名' },
              { min: 4, max: 30, message: '长度在 4 到 30 个字符' },
            ],
          },
        },
        password: {
          title: '密码',
          type: 'text',
          column: { show: false },
          viewForm: {
            show: false,
          },
          editForm: {
            show: false,
          },
          form: {
            rules: [
              { required: true, message: '请输入密码' },
              { min: 6, max: 30, message: '长度在 6 到 30 个字符' },
            ],
          },
        },
        nickName: {
          title: '昵称',
          type: 'text',
          column: { width: 155, ellipsis: true },
          search: { show: true, fixed: 'left' },
          form: {
            rules: [
              { required: true, message: '请输入昵称' },
              { min: 2, max: 30, message: '长度在 2 到 30 个字符' },
            ],
          },
        },
        mobile: {
          title: '手机号',
          type: 'text',
          search: { show: true },
          column: { width: 155, align: 'center' },
          form: {
            rules: [
              { required: true, message: '请输入手机号' },
              { min: 11, max: 11, message: '长度在 11 个字符' },
            ],
          },
        },
        sex: {
          title: '性别',
          type: 'dict-radio',
          search: { show: true },
          dict: dict({
            url: '/authority/dictionaries/sex/list',
          }),
          viewForm: {
            valueBuilder(context) {
              context.form.sex = context.row.sex.toString();
            },
          },
          editForm: {
            valueBuilder(context) {
              context.form.sex = context.row.sex.toString();
            },
          },
          column: {
            width: 100,
            align: 'center',
            filterable: true,
            filterMultiple: false,
            filters: [
              { text: '男', value: 1 },
              { text: '女', value: 2 },
            ],
            onFilter: (value, record) => {
              // expose.doRefresh();
              // console.log('query', search);
              return record.sex === value;
            },
            // component: {
            //   onSearch: ({ form }) => {
            //     return function (value) {
            //       console.log('form', form);
            //       // fetchReceiver(form.type, value);
            //     };
            //   },
            // },
            sortDirections: ['descend'],
          },
          addForm: {
            value: '1',
          },
        },
        email: {
          title: '邮箱',
          type: 'text',
          search: { show: true },
          column: { width: 180 },
        },
        avatar: {
          title: '头像',
          type: 'cropper-uploader',
          style: { height: 70 },
          column: { width: 70, align: 'center' },
          valueBuilder({ value, row, key }) {
            if (value != null && value.indexOf('http')) {
              row[key] = 'http://www.docmirror.cn:7070' + value;
            }
          },
          form: {
            component: {
              uploader: {
                type: 'qiniu', // 上传后端类型【cos,aliyun,oss,form】
                buildUrl(res) {
                  return 'http://www.docmirror.cn:7070/' + res.url;
                },
              },
            },
          },
        },
        orgId: {
          title: '组织',
          search: { show: true, component: { style: { width: '150px' } } },
          type: 'dict-tree',
          column: {
            width: 180,
            component: {
              style: {
                color: 'red',
              },
            },
          },
          dict: dict({
            isTree: true,
            url: '/authority/org/trees',
            value: 'id',
            label: 'name',
          }),
          form: {
            component: {
              replaceFields: { children: 'children', title: 'name', key: 'id', value: 'id' },
              showSearch: true,
              filterTreeNode: (val, treeNode) => {
                return treeNode.props.title.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
            valueChange({ form, value, getComponentRef }) {
              form.stationId = undefined; // 将“stationId”的值置空
              if (value) {
                // 执行 stationId 的select组件的reloadDict()方法，触发“stationId”重新加载字典
                getComponentRef('stationId').reloadDict();
              }
            },
          },
        },
        stationId: {
          title: '岗位',
          type: 'dict-select',
          column: { width: 150 },
          dict: dict({
            // cache: true,
            prototype: true,
            value: 'id',
            label: 'name',
            url({ form }) {
              if (form && form.orgId != null) {
                // 本数据字典的url是通过前一个select的选项决定的
                return `/authority/stations?status=1&orgId=${form.orgId}`;
              }
              return undefined;
            },
            getData: ({ form }) => {
              if (form.orgId) {
                return GET(`/authority/stations?status=1&orgId=${form.orgId}`).then((ret) => {
                  return ret.data.records.map((item) => {
                    return { color: 'warning', ...item };
                  });
                });
              }
            },
          }),
          form: {
            component: {
              showSearch: true,
              filterOption: (val, form) => {
                return form.label.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
          },
        },
        positionStatus: {
          title: '职位状态',
          type: 'dict-select',
          column: { width: 90 },
          dict: dict({
            data: [
              { value: 'WORKING', label: '在职', color: 'success' },
              { value: 'QUIT', label: '离职', color: 'error' },
              { value: 'LEAVE', label: '请假', color: 'warning' },
            ],
          }),
        },
        nation: {
          title: '民族',
          type: 'dict-select',
          column: { width: 90 },
          dict: dict({
            url: '/authority/dictionaries/NATION/list',
          }),
          form: {
            component: {
              showSearch: true,
              filterOption: (val, form) => {
                return form.label.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
          },
        },
        education: {
          title: '学历',
          type: 'dict-select',
          column: { width: 90 },
          dict: dict({
            url: '/authority/dictionaries/EDUCATION/list',
          }),
          form: {
            component: {
              showSearch: true,
              filterOption: (val, form) => {
                return form.label.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
          },
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 180, sorter: true },
          form: {
            show: false,
          },
          editForm: {
            show: false,
          },
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
          type: 'collapse', // tab
          accordion: false, //手风琴模式
          groups: {
            baseInfo: {
              header: '基础信息',
              columns: ['username', 'password', 'nickName', 'sex'],
            },
            orgInfo: {
              header: '职位信息',
              columns: ['orgId', 'stationId', 'positionStatus'],
            },
            linkInfo: {
              header: '联系方式',
              columns: ['mobile', 'email'],
            },
            otherInfo: {
              header: '其它信息',
              collapsed: false, //默认折叠
              columns: ['nation', 'education', 'avatar', 'createdTime'],
            },
          },
        },
      },
    },
  };
}
