import * as api from './api';
import { dict } from '@fast-crud/fast-crud';
import { ref } from 'vue';
import moment from "moment";

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
  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      table: {
      },
      columns: {
        id: {
          title: '国标码',
          type: 'text',
          form: {
            rules: [{ required: true, message: '请输入国标码' }],
          },
        },
        name: {
          title: '名称',
          type: 'text',
          search: { show: true },
          form: {
            rules: [{ required: true, message: '请输入名称' }],
          },
        },
        parentLabel: {
          title: '父节点名称',
          column: { show: false },
          viewForm: {
            disabled: true,
          },
        },
        parentId: {
          title: '父节点',
          column: { show: false },
        },
        longitude: {
          title: '经度',
          type: 'text',
          column: { align: 'center' },
        },
        latitude: {
          title: '纬度',
          type: 'text',
          column: { align: 'center' },
        },
        sequence: {
          title: '排序',
          type: 'number',
          column: { show: false },
          addForm: {
            value: 0,
          },
        },
        level: {
          title: '级别',
          type: 'dict-select',
          column: { align: 'center' },
          dict: dict({
            data: [
              { value: 1, label: '省', color: 'success' },
              { value: 2, label: '市', color: 'warning' },
              { value: 3, label: '区', color: 'warning' },
              { value: 4, label: '镇', color: 'warning' },
              { value: 5, label: '街道', color: 'error' },
            ],
          }),
        },
        source: {
          title: '来源',
          type: 'textarea',
          column: {
            ellipsis: true,
          },
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          addForm: { show: false },
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
