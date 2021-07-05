import * as api from './api';
import { request } from '/src/api/service';
import { dict } from '@fast-crud/fast-crud';

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
          title: '岗位名称',
          type: 'text',
          search: { show: true },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          column: { align: 'center' },
          search: { show: true },
          dict: dict({
            data: [
              { value: true, label: '启用', color: 'success' },
              { value: false, label: '禁用', color: 'error' },
            ],
          }),
        },
        orgId: {
          title: '组织',
          search: { show: true },
          type: 'dict-tree',
          dict: dict({
            isTree: true,
            url: '/authority/org/trees',
            value: 'id',
            label: 'name',
            onReady: ({ dict }) => {
              dict.data.forEach((item) => {
                item.color =
                  item.id % 2 === 0 ? 'warning' : item.id % 3 === 0 ? 'success' : 'error';
              });
            },
          }),
          form: {
            component: {
              replaceFields: { children: 'children', title: 'name', key: 'id', value: 'id' },
              showSearch: true,
              filterTreeNode: (val, treeNode) => {
                return treeNode.props.title.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
          },
        },
        description: {
          title: '描述',
          key: 'description',
          type: 'textarea',
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
        },
      },
    },
  };
}
