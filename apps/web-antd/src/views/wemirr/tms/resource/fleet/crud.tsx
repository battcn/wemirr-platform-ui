import * as api from './api';

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
      form: {
        wrapper: {
          is: 'a-modal',
        },
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
        fleetName: {
          title: '车队名称',
          type: 'text',
          search: { show: true },
          column: { width: 200 },
          form: {
            col: { span: 24 },
            wrapperCol: { span: 10 },
            rules: [{ required: true, message: '请输入车队名称' }],
          },
        },
        leaderRealName: {
          title: '队长名称',
          type: 'text',
          search: { show: true },
          column: { width: 200 },
          form: {
            col: { span: 24 },
            wrapperCol: { span: 10 },
            rules: [{ required: true, message: '请输入队长姓名' }],
          },
        },
        leaderMobile: {
          title: '队长手机',
          type: 'text',
          column: { width: 200 },
          form: {
            col: { span: 24 },
            wrapperCol: { span: 10 },
            rules: [
              { required: true, message: '请输入队长手机' },
              {
                pattern: /^1\d{10}$/,
                message: '队长手机号格式错误',
              },
            ],
          },
        },
        remark: {
          title: '备注',
          type: ['textarea'],
          column: { width: 200 },
          form: {
            col: {
              span: 24,
            },
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
