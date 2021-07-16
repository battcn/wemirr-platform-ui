import * as api from './api';
import { ref, shallowRef } from 'vue';
import SubTable from './sub-table/index.vue';
import { dict } from '@fast-crud/fast-crud';
import moment from 'moment';
export default function ({ expose, asideTableRef }) {
  const pageRequest = async (query) => {
    return await api.GetList(query).then((ret) => {
      return ret.data;
    });
  };
  const editRequest = async ({ form }) => {
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
      columns: {
        name: {
          title: '名称',
          search: { show: true },
          type: 'text',
        },
        code: {
          title: '编码',
          search: { show: true },
          type: 'text',
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          search: { show: true },
          column: { show: true, width: 100, align: 'center' },
          dict: dict({
            data: [
              { value: true, label: '启用', color: 'success' },
              { value: false, label: '禁用', color: 'error' },
            ],
          }),
          addForm: { value: true },
        },
        readonly: {
          title: '内置',
          type: 'dict-radio',
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
        sequence: {
          title: '排序',
          column: { width: 50, align: 'center' },
          type: 'number',
          addForm: { value: 0 },
          form: { component: { min: 0, max: 100 } },
        },
        description: {
          title: '描述',
          type: ['textarea', 'colspan'],
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          form: { show: false },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = moment(value);
            }
          },
        },
        id: {
          title: '字典信息',
          column: { show: false },
          type: ['text-area', 'colspan'],
          // form: { show: false },
          viewForm: {
            show: true,
            // 嵌套表格字段
            component: {
              //局部引用子表格，要用shallowRef包裹
              name: shallowRef(SubTable),
              vModel: 'modelValue',
            },
          },
        },
      },
    },
  };
}
