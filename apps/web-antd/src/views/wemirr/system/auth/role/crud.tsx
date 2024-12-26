import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  UserPageQuery,
} from '@fast-crud/fast-crud';

import { useAccess } from '@vben/access';

import { compute, dict } from '@fast-crud/fast-crud';

import * as api from './api';

export default function crud(
  props: CreateCrudOptionsProps,
): CreateCrudOptionsRet {
  const { assign } = props.context;
  const { hasPermission } = useAccess();
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery) => await api.GetList(query),
        addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        editRequest: async ({ form }: EditReq) => await api.UpdateObj(form),
        delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
      },
      table: { size: 'small', scroll: { fixed: true } },
      rowHandle: {
        show: true,
        width: 220,
        dropdown: {
          atLeast: 2,
          more: {
            size: 'small',
            icon: '',
            text: '更多',
          },
        },
        buttons: {
          distribution: {
            text: '分配用户',
            size: 'small',
            type: 'link',
            order: 4,
            show: hasPermission('sys:role:assign-users'),
            async click({ row }: any) {
              await assign.userModal(row.id);
            },
          },
          resource: {
            text: '分配权限',
            type: 'link',
            size: 'small',
            order: 5,
            show: hasPermission('sys:role:assign-resource'),
            async click({ row }: any) {
              await assign.resourceModal(row.id);
            },
          },
        },
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
          column: { width: 180 },
          search: { show: true },
        },
        code: {
          title: '编码',
          type: 'text',
          column: { width: 180 },
          form: {
            rules: [
              { required: true, message: '请输入编码' },
              { min: 2, max: 30, message: '长度在 2 到 30 个字符' },
            ],
          },
        },
        readonly: {
          title: '内置角色',
          type: 'dict-radio',
          column: { width: 90, align: 'center' },
          form: { show: false },
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          search: { show: true },
          column: { width: 100, align: 'center' },
          addForm: { value: true },
          dict: dict({
            data: [
              { value: true, label: '启用', color: 'success' },
              { value: false, label: '禁用', color: 'error' },
            ],
          }),
        },
        scopeType: {
          title: '权限范围',
          search: { show: true },
          type: 'dict-select',
          column: { width: 150 },
          dict: dict({
            data: [
              { value: 10, label: '个人', color: 'warning' },
              { value: 20, label: '自定义', color: 'error' },
              { value: 30, label: '本级', color: 'warning' },
              { value: 40, label: '本级及子级', color: 'success' },
              { value: 50, label: '全部', color: 'success' },
            ],
          }),
          form: {
            rules: [{ required: true, message: '请输入编码' }],
            component: { radioName: 'a-radio-button' },
            // valueChange: ({ value, form, ...content }) => {},
          },
        },
        description: {
          title: '描述',
          search: { show: false },
          column: { width: 170, ellipsis: true },
          type: ['textarea'],
          form: {
            col: { span: 24 },
          },
        },
        orgList: {
          search: { show: false },
          title: '机构',
          form: {
            show: compute(({ form }) => {
              return form.scopeType === 20;
            }),
          },
          column: { show: false },
        },
        createdTime: {
          title: '创建时间',
          type: ['datetime', 'wp-readonly-time'],
        },
      },
    },
  };
}
