import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';

import { dict, utils } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';

export default function (props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  utils.logger.debug('crud props', props);
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) => {
          return await defHttp.get(`/iam/positions/page`, { params: query });
        },
        addRequest: async ({ form }: AddReq) => {
          return await defHttp.post(`/iam/positions/create`, form);
        },
        editRequest: async ({ form }: EditReq) => {
          return await defHttp.put(`/iam/positions/${form.id}/modify`, form);
        },
        delRequest: async ({ row }: DelReq) => {
          return await defHttp.delete(`/iam/positions/${row.id}`);
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        title: {
          title: '名称',
          type: 'text',
          column: { width: 150 },
          search: { show: true },
          form: {
            rules: [
              { required: true, message: '岗位名称不能为空' },
              { min: 1, max: 30, message: '长度在 1 到 30 个字符' },
            ],
          },
        },
        code: {
          title: '编码',
          type: 'text',
          column: { width: 100 },
        },
        sequence: {
          title: '排序',
          column: { width: 80, align: 'center', show: false },
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
          column: { width: 100, align: 'center' },
          search: { show: true },
          addForm: {
            value: 1,
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
          search: { show: true, order: 0 },
          column: { width: 200, component: { color: 'auto' } },
          type: 'dict-tree',
          dict: dict({
            isTree: true,
            url: '/iam/org/trees',
            value: 'id',
            label: 'name',
          }),
          form: {
            // component: {
            //   fieldNames: {
            //     children: 'children',
            //     title: 'name',
            //     key: 'id',
            //     value: 'id',
            //   },
            //   showSearch: true,
            //   filterTreeNode: (val: any, treeNode: any) => {
            //     return treeNode.props.title
            //       .toLowerCase()
            //       .includes(val.toLowerCase());
            //   },
            // },
            col: { span: 24 },
            rules: [{ required: true, message: '组织名称不能为空' }],
          },
        },
        description: {
          title: '描述',
          search: { show: false },
          type: ['textarea'],
          form: {
            col: { span: 24 },
          },
          column: { width: 220, ellipsis: true },
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 170, sorter: true, align: 'center' },
          addForm: { show: false },
          editForm: { show: false },
          valueBuilder({ value, row, key }: any) {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
    },
  };
}
