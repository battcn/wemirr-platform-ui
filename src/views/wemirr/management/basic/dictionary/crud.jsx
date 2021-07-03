import * as api from './api';
import { ref, shallowRef } from 'vue';
import SubTable from './sub-table/index.vue';
import { dict } from '@fast-crud/fast-crud';
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
  const currentRow = ref();
  const onCurrentRowChange = (id) => {
    currentRow.value = id;
    // asideTableRef.value.setSearchFormData({ form: { id: id } });
    // asideTableRef.value.doRefresh();
  };
  return {
    crudOptions: {
      table: {
        customRow(record, index) {
          const clazz = record.id === currentRow.value ? 'fs-current-row' : '';
          return {
            onClick() {
              onCurrentRowChange(record.id);
            },
            class: clazz,
          };
        },
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      rowHandle: {
        width: 200,
        center: true,
        buttons: {
          view: { size: 'small', show: true },
          edit: { size: 'small' },
          remove: { size: 'small' },
        },
      },
      form: {
        // wrapper: {
        //   is: 'a-dialog',
        // },
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
          dict: dict({
            data: [
              { value: true, label: '启用', color: 'success' },
              { value: false, label: '禁用', color: 'error' },
            ],
          }),
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 180, sortable: true },
          form: {
            show: false,
          },
        },
        id: {
          title: '字典信息',
          column: { show: false },
          type: ['text-area', 'colspan'],
          form: {
            show: false,
          },
          viewForm: {
            show: true,
            // 嵌套表格字段
            rules: [{ required: true, message: '请选择用户' }],
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
