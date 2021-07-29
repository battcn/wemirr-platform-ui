import * as api from './api';
import { dict } from '@fast-crud/fast-crud';

export default function ({ expose, nodeRef }) {
  const pageRequest = async (query) => {
    return await api.GetResourceList({ parentId: nodeRef.value.id, type: '2', size: query.size });
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
  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      rowHandle: {
        show: true,
        width: 90,
        fixed: 'right',
        dropdown: {
          // 操作列折叠
          atLeast: 1,
          more: { size: 'small', text: '', icon: 'gg:more-o' },
        },
      },
      toolbar: {
        compact: true,
        buttons: { search: { show: false } },
      },
      actionbar: { buttons: { add: { show: false } } },
      table: { size: 'small', scroll: { fixed: true } },
      search: { show: false },
      buttons: { show: false },
      columns: {
        id: {
          title: 'ID',
          type: 'number',
          column: { show: false },
          form: { show: false },
        },
        parentId: {
          title: '父ID',
          type: 'text',
          column: { show: false },
          addForm: {
            value: null,
          },
          form: {
            component: {
              disabled: true,
            },
            rules: [{ required: true, message: '请选择菜单后操作' }],
          },
        },
        type: {
          title: '类型',
          type: 'dict-select',
          column: { show: false },
          dict: dict({
            data: [
              { value: 1, label: '菜单' },
              { value: 2, label: '按钮' },
            ],
          }),
          addForm: { value: 2 },
          form: { component: { disabled: true } },
        },
        label: {
          title: '名称',
          type: 'text',
          column: { width: 120, ellipsis: true },
          form: {
            rules: [{ required: true, message: '请填写资源名称' }],
          },
        },
        permission: {
          title: '编码',
          type: 'text',
          form: {
            component: {
              placeholder: '资源权限编码',
            },
            rules: [{ required: true, message: '请填写资源权限编码' }],
            helper: '如（user:management:add user:management:edit）',
          },
          column: { width: 250, ellipsis: true },
        },
        sequence: {
          title: '排序',
          type: 'number',
          column: { width: 50, align: 'center' },
          addForm: { value: 0 },
          form: { component: { min: 0, max: 100 } },
        },
        description: {
          title: '描述',
          column: { show: false, ellipsis: true },
          type: ['textarea', 'colspan'],
        },
      },
    },
  };
}
