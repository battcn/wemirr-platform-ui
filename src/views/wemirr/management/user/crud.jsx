import * as api from './api';
import { request } from '/src/api/service';
import { dict } from '@fast-crud/fast-crud';

export default function ({ expose }) {
  const pageRequest = async (query) => {
    return await api.GetList(query).then((ret) => {
      return ret.data;
    });
  };
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.id);
  };

  const addRequest = async ({ form }) => {
    return await api.AddObj(form);
  };

  console.log('expose', expose);
  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      table: {
        size: 'small',
        scroll: {
          //需要设置它，否则滚动条拖动时，表头不会动
          fixed: true,
          x: 1400,
        },
        pagination: false,
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
          column: { width: 155 },
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
            label: 'name',
            onReady: ({ dict }) => {
              dict.data.forEach((item) => {
                item.color = item.value === '1' ? 'warning' : 'error';
              });
            },
          }),
          column: {
            width: 100,
            align: 'center',
            filterable: true,
            filters: [
              { text: '男', value: 1 },
              { text: '女', value: 2 },
            ],
            onFilter: (value, record) => {
              return record.sex === value;
            },
            sortDirections: ['descend'],
          },
        },
        email: {
          title: '邮箱',
          type: 'email',
          column: { width: 180 },
        },
        avatar: {
          title: '头像',
          type: 'image-uploader',
          style: { height: 70 },
          column: { width: 70, align: 'center' },
        },
        orgId: {
          title: '组织',
          search: { show: true },
          type: 'dict-tree',
          column: { width: 90 },
          dict: dict({
            isTree: true,
            url: '/authority/org/trees',
            value: 'id',
            label: 'name',
            onReady: ({ dict }) => {
              dict.data.forEach((item) => {
                item.color =
                  item.id % 2 === 0 ? 'warning' : item.id % 3 === 0 ? 'success' : 'error';
              });
            },
          }),
          form: {
            component: {
              replaceFields: { children: 'children', title: 'name', key: 'id', value: 'id' },
              showSearch: true,
              filterTreeNode: (val, treeNode) => {
                return treeNode.props.title.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
          },
        },
        stationId: {
          title: '岗位',
          type: 'dict-select',
          column: { width: 90 },
          dict: dict({
            value: 'id',
            label: 'name',
            url: '/authority/stations',
            onReady: ({ dict }) => {
              dict.data.forEach((item) => {
                item.color =
                  item.id % 5 === 0 ? 'success' : item.id % 3 === 0 ? 'warning' : 'error';
              });
            },
            getData: (dict) => {
              return request({ url: dict.dict.url }).then((ret) => {
                return ret.data.records;
              });
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
            label: 'name',
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
            label: 'name',
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
