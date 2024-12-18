import { useAccess } from '@vben/access';

import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import * as api from './api';

export default function ({ distribution }) {
  const { hasPermission } = useAccess();
  return {
    crudOptions: {
      table: {},
      request: {
        pageRequest: async (query: any) => await api.GetList(query),
        addRequest: async ({ form }) => await api.AddObj(form),
        editRequest: async ({ form }) => await api.UpdateObj(form),
        delRequest: async ({ row }) => await api.DelObj(row.id),
      },
      toolbar: {},
      rowHandle: {
        buttons: {
          resource: {
            text: '分配权限',
            type: 'link',
            size: 'small',
            order: 5,
            show: hasPermission('sys:role:distribution:res'),
            async click({ row }) {
              await distribution.resourceModal(row.id);
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
          column: { width: 180 },
          search: { show: true },
          form: {
            rules: [{ required: true, message: '名称不能为空' }],
            helper: '请填写符合场景的产品名称',
          },
        },
        logo: {
          title: 'LOGO',
          type: 'cropper-uploader',
          column: {
            width: 130,
            align: 'center',
          },
          form: {
            rules: [{ required: false, message: 'LOGO不能为空' }],
            component: {
              uploader: {
                type: 'qiniu',
                buildUrl(res) {
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
          column: { show: false },
          type: ['textarea'],
          form: {
            rules: [{ required: true, message: '描述不能为空' }],
            col: {
              span: 24,
            },
          },
        },
        createdName: {
          title: '创建人',
          type: 'text',
          addForm: { show: false },
          editForm: { show: false },
          column: { width: 150, ellipsis: true },
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 170, sorter: true, align: 'center' },
          addForm: { show: false },
          editForm: { show: false },
          valueBuilder({ value, row, key }: any) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
    },
  };
}
