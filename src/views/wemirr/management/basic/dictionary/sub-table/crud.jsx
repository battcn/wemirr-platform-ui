import * as api from './api';
export default function ({ expose, props, ctx }) {
  const pageRequest = async (query) => {
    return await api.GetItemList({ ...query, id: props.modelValue }).then((ret) => {
      return ret.data;
    });
  };
  const editRequest = async ({ form }) => {
    return await api.UpdateItemObj(form.form, form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelItemObj(row.id);
  };
  const addRequest = async ({ form }) => {
    return await api.AddItemObj(form);
  };

  return {
    crudOptions: {
      table: {
        customRow(record, index) {
          const clazz = record.id === props.modelValue ? 'fs-current-row' : '';
          return {
            onClick() {
              ctx.emit('update:modelValue', record.id);
            },
            class: clazz,
          };
        },
      },
      form: {
        wrapper: {
          is: 'a-modal',
        },
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      rowHandle: {
        width: 150,
        align: 'center',
        buttons: {
          view: { size: 'small', show: false },
          edit: { size: 'small' },
          remove: { size: 'small' },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        dictionaryId: {
          title: '字典ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        label: {
          title: '名称',
          search: { show: true },
          type: 'text',
          column: {
            width: 80,
            align: 'center',
            sorter: true,
          },
        },
        value: {
          title: '值',
          search: { show: false },
          type: 'text',
          column: {
            sorter: true,
          },
        },
        color: {
          title: '颜色',
          type: 'text',
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 180, sorter: true },
          form: { show: false },
        },
      },
    },
  };
}
