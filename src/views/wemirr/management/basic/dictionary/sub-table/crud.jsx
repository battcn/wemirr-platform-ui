import * as api from './api';
import moment from 'moment';
import { dict } from '@fast-crud/fast-crud';
export default function ({ expose, props, ctx }) {
  console.log('props', props, ctx);
  const pageRequest = async (query) => {
    return await api.GetItemList({ ...query, id: props.modelValue }).then((ret) => {
      return ret.data;
    });
  };
  const editRequest = async ({ form }) => {
    return await api.UpdateItemObj(props.modelValue, form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelItemObj(props.modelValue, row.id);
  };
  const addRequest = async ({ form }) => {
    console.log('form', form);
    return await api.AddItemObj(props.modelValue, form);
  };

  return {
    crudOptions: {
      // form: {
      //   wrapper: {
      //     is: 'a-modal',
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
              { value: true, label: '启用', color: 'success' },
              { value: false, label: '禁用', color: 'error' },
            ],
          }),
          addForm: { value: true },
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
              row[key] = moment(value);
            }
          },
        },
      },
    },
  };
}
