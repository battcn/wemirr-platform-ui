import * as api from './api';
export default function ({ expose, props, ctx }) {
  const pageRequest = async (query) => {
    console.log('props', props);
    console.log('ctx', ctx);
    return await api.GetItemList({ ...query, id: props.modelValue }).then((ret) => {
      return ret.data;
    });
  };
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
    return await api.UpdateItemObj(form);
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
      // form: {
      //   wrapper: {
      //     is: 'a-dialog',
      //   },
      // },
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
        name: {
          title: '名称',
          search: { show: true },
          type: 'text',
          column: {
            width: 80,
            align: 'center',
            sortable: true,
          },
        },
        value: {
          title: '值',
          search: { show: false },
          type: 'text',
          column: {
            sortable: true,
          },
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 180, sortable: true },
          form: { show: false },
        },
      },
    },
  };
}
