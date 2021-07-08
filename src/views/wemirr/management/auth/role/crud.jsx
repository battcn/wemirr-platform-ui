import * as api from './api';
import { dict, compute } from '@fast-crud/fast-crud';

export default function ({ expose, distribution }) {
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
        },
      },
      rowHandle: {
        show: true,
        width: 350,
        dropdown: {
          // 操作列折叠
          atLeast: 3,
          more: { size: 'small', text: 'more' },
        },
        buttons: {
          distribution: {
            text: '分配用户',
            size: 'small',
            order: 4,
            show: true,
            async click(context) {
              await distribution.userModal(context.record.id);
            },
          },
          resource: {
            text: '分配权限',
            size: 'small',
            order: 5,
            show: true,
            async click(context) {
              await distribution.resourceModal(context.record.id);
            },
          },
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
          column: { width: 155 },
          search: { show: true },
        },
        code: {
          title: '编码',
          type: 'text',
          column: { width: 150 },
          form: {
            rules: [
              { required: true, message: '请输入编码' },
              { min: 2, max: 30, message: '长度在 2 到 30 个字符' },
            ],
          },
        },
        readonly: {
          title: '内置角色',
          type: 'dict-radio',
          search: { show: true },
          column: { width: 90, align: 'center' },
          addForm: { show: false },
          editForm: {
            component: {
              disabled: true,
            },
          },
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
        },
        locked: {
          title: '状态',
          type: 'dict-radio',
          column: { width: 90, align: 'center' },
          form: { disabled: true },
          dict: dict({
            data: [
              { value: false, label: '启用', color: 'success' },
              { value: true, label: '禁用', color: 'error' },
            ],
          }),
        },
        description: {
          title: '描述',
          column: { width: 100 },
          search: { show: false },
          type: 'textarea',
          form: {
            show: compute((context) => {
              // grid跨列模式下使用flex模式的设置会显示异常，为了演示效果，在grid模式下隐藏
              return context.form.display !== 'grid';
            }),
            col: { span: 24 }, // flex模式跨列配置
            labelCol: { span: 2 }, // antdv 跨列时，需要同时修改labelCol和wrapperCol
            wrapperCol: { span: 21 },
          },
        },
        scopeType: {
          title: '权限范围',
          type: 'dict-select',
          column: { width: 100 },
          dict: dict({
            data: [
              { value: 10, label: '个人', color: 'warning' },
              { value: 20, label: '自定义', color: 'error' },
              { value: 30, label: '本级', color: 'warning' },
              { value: 40, label: '本级及子级', color: 'success' },
              { value: 50, label: '全部', color: 'success' },
            ],
          }),
          form: {
            component: { radioName: 'a-radio-button' },
            valueChange: ({ value, form, ...content }) => {
              console.log('value', value, 'form', form, 'content', content);
            },
          },
        },
        orgList: {
          search: { show: false },
          column: { show: false },
          form: {
            // labelCol: { span: 10 },
            // wrapperCol: { span: 10 },
          },
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 180, sorter: true },
          addForm: { show: false },
          editForm: { show: false },
        },
      },
    },
  };
}
