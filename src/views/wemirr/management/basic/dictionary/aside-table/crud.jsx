import * as api from './api';
import { dict } from '@fast-crud/fast-crud';
export default function ({ expose }) {
  const pageRequest = async (query) => {
    return await api.GetItemList(query);
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
      pagination: {
        showSizeChanger: false,
        showQuickJumper: false,
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      toolbar: {
        compact: false,
      },
      rowHandle: {
        width: '200px',
        align: 'center',
      },
      table: {},
      columns: {
        name: {
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
      },
    },
  };
}
