import dayjs from 'dayjs';
import { dict } from '@fast-crud/fast-crud';
import { GET, POST, PUT, DELETE } from '/src/api/service';
export default function ({ expose, props, ctx }) {
  console.log('expose,ctx', expose, ctx);
  let dictionaryId = props.modelValue;
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => {
          return await GET(`/authority/dictionaries/${dictionaryId ?? 0}/items`, query);
        },
        addRequest: async ({ form }) =>
          await POST(`/authority/dictionaries/${dictionaryId}/items`, form),
        editRequest: async ({ form }) =>
          await PUT(`/authority/dictionaries/${dictionaryId}/items/${form.id}`, form),
        delRequest: async ({ row }) =>
          await DELETE(`/authority/dictionaries/${dictionaryId}/items/${row.id}`),
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
          type: 'dict-select',
          column: { width: 100 },
          dict: dict({
            url: '/authority/dictionaries/COLOR/list',
          }),
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          search: { show: true },
          dict: dict({
            data: [
              { value: 1, label: '启用', color: 'success' },
              { value: 0, label: '禁用', color: 'error' },
            ],
          }),
          addForm: { value: 1 },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = value === true ? 1 : 0;
            }
          },
        },
        sequence: {
          title: '排序',
          column: { width: 50, align: 'center' },
          type: 'number',
          addForm: { value: 0 },
          form: { component: { min: 0, max: 100 } },
        },
        description: {
          title: '描述',
          column: { show: false },
          type: ['textarea', 'colspan'],
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 180, sorter: true },
          form: { show: false },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
    },
  };
}
