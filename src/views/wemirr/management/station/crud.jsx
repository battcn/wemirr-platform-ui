import * as api from './api';
import { dict } from '@fast-crud/fast-crud';
import moment from 'moment';

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
          search: { show: true },
        },
        code: {
          title: '编码',
          type: 'text',
        },
        type: {
          title: '类型',
          type: 'dict-select',
          search: { show: true },
          dict: dict({
            url: '/authority/dictionaries/STATION_TYPE/list',
          }),
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = value.toString();
            }
          },
        },
        sequence: {
          title: '排序',
          column: { width: 50, align: 'center' },
          type: 'number',
          addForm: {
            value: 0,
            component: { min: 0, max: 100 },
          },
          editForm: { component: { min: 0, max: 100 } },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          column: { align: 'center' },
          search: { show: true },
          addForm: {
            value: true,
          },
          dict: dict({
            data: [
              { value: true, label: '启用', color: 'success' },
              { value: false, label: '禁用', color: 'error' },
            ],
          }),
        },
        orgId: {
          title: '组织',
          search: { show: true, labelCol: { span: 6 }, component: { style: { width: '150px' } } },
          type: 'dict-tree',
          dict: dict({
            isTree: true,
            url: '/authority/org/trees',
            value: 'id',
            label: 'name',
          }),
          form: {
            component: {
              replaceFields: { children: 'children', title: 'name', key: 'id', value: 'id' },
              showSearch: true,
              filterTreeNode: (val, treeNode) => {
                return treeNode.props.title.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
            col: { span: 24 },
            labelCol: { span: 2 },
            wrapperCol: { span: 9 },
          },
        },
        description: {
          title: '描述',
          search: { show: false },
          type: ['textarea', 'colspan'],
          column: { width: 180, ellipsis: true },
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 180, sorter: true },
          addForm: {
            show: false,
          },
          editForm: {
            show: false,
          },
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
