import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  UserPageQuery,
} from '@fast-crud/fast-crud';

import { useAccess } from '@vben/access';

import { dict } from '@fast-crud/fast-crud';

import * as api from './api';

export default function crud(
  props: CreateCrudOptionsProps,
): CreateCrudOptionsRet {
  const { assign } = props.context;
  const { hasPermission } = useAccess();
  return {
    crudOptions: {
      table: {},
      request: {
        pageRequest: async (query: UserPageQuery) => await api.GetList(query),
        addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        editRequest: async ({ form }: EditReq) => await api.UpdateObj(form),
        delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
      },
      toolbar: {},
      rowHandle: {
        width: 230,
        buttons: {
          resource: {
            text: '授权',
            type: 'link',
            size: 'small',
            order: 2,
            show: hasPermission('product:definition:assign'),
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
        code: {
          title: '产品编码',
          type: 'text',
          addForm: { show: false },
          editForm: { show: false },
          column: { width: 150 },
          search: { show: true },
        },
        name: {
          title: '产品名称',
          type: 'text',
          column: { width: 200 },
          search: { show: true },
          form: {
            rules: [{ required: true, message: '名称不能为空' }],
            helper: '请填写符合场景的产品名称',
          },
        },
        logo: {
          title: 'LOGO',
          type: 'cropper-uploader',
          column: { width: 120, align: 'center' },
          form: {
            rules: [{ required: false, message: 'LOGO不能为空' }],
            component: {
              uploader: {
                type: 'form',
                buildUrl(res: any) {
                  return res.url;
                },
              },
            },
          },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          column: { width: 100, align: 'center' },
          search: { show: true },
          dict: dict({
            data: [
              { value: true, label: '启用', color: 'success' },
              { value: false, label: '禁用', color: 'error' },
            ],
          }),
          form: {
            show: false,
          },
        },
        description: {
          title: '产品描述',
          column: { width: 200, show: true, ellipsis: true },
          type: ['textarea'],
          form: {
            rules: [{ required: true, message: '描述不能为空' }],
            col: {
              span: 24,
            },
          },
        },
        createName: {
          title: '创建人',
          type: 'text',
          addForm: { show: false },
          editForm: { show: false },
          column: { width: 150, ellipsis: true },
        },
        createTime: {
          title: '创建时间',
          type: ['datetime', 'wp-readonly-time'],
        },
      },
    },
  };
}
