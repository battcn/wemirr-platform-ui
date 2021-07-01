import * as api from './api';
// import { request } from '/src/api/service';
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
          form: { disabled: true },
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'danger' },
            ],
          }),
        },
        scopeType: {
          title: '权限范围',
          type: 'dict-radio',
          dict: dict({
            data: [
              { value: 10, label: '个人', color: 'warning' },
              { value: 20, label: '自定义', color: 'error' },
              { value: 30, label: '本级', color: 'warning' },
              { value: 40, label: '本级及子级', color: 'success' },
              { value: 50, label: '全部', color: 'success' },
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
              { value: true, label: '禁用', color: 'danger' },
            ],
          }),
        },
        description: {
          title: '描述',
          type: 'text-area',
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 180, sortable: true },
          addForm: {
            show: false,
          },
          editForm: {
            show: false,
          },
        },
      },
    },
  };
}
