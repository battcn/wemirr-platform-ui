import * as api from './api';
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
      form: {
        wrapper: {
          is: 'a-drawer',
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false, width: 55, align: 'center' },
        },
        username: {
          title: '账号',
          type: 'text',
          search: { show: true },
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
              { min: 2, max: 30, message: '长度在 2 到 30 个字符' },
            ],
          },
        },
        nickName: {
          title: '昵称',
          type: 'text',
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
          column: { width: 50, align: 'center', filterable: true, sorter: true },
          search: { show: true }, // 开启查询
          dict: dict({
            url: '/authority/dictionaries/sex/list',
            onReady: ({ dict }) => {
              dict.data.forEach((item) => {
                item.label = item.name;
                item.color = item.value === '1' ? 'warning' : 'error';
              });
            },
          }),
        },
        email: {
          title: '邮箱',
          type: 'email',
        },
        avatar: {
          title: '头像',
          type: 'image-uploader',
        },
        orgId: {
          title: '组织',
          type: 'text',
        },
      },
      // form: {
      //   group: {
      //     type: 'collapse', // tab
      //     accordion: false, //手风琴模式
      //     groups: {
      //       base: {
      //         slots: {
      //           //自定义header
      //           header: () => {
      //             return (
      //               <span style={'color:green'}>
      //                 商品基础
      //                 <CheckOutlined style={'margin-left:10px;'} />
      //               </span>
      //             );
      //           },
      //         },
      //         columns: ['code', 'title', 'images'],
      //       },
      //       price: {
      //         header: '库存价格',
      //         columns: ['store', 'price'],
      //       },
      //       info: {
      //         header: '详情',
      //         collapsed: true, //默认折叠
      //         columns: ['intro', 'content'],
      //       },
      //     },
      //   },
      // },
    },
  };
}
