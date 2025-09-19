import type {
  AddReq,
  DelReq,
  EditReq,
  UserPageQuery,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';

import { brandTable } from '#/views/wemirr/wms/table-select';

import * as api from './api';

export default function crud({ crudExpose }) {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery) => await api.GetList(query),
        addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        editRequest: async ({ form }: EditReq) => await api.UpdateObj(form),
        delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {},
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        code: {
          title: '编号',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160, fixed: 'left' },
          addForm: { show: false },
          editForm: { show: false },
        },
        name: {
          title: '物称',
          type: 'textarea',
          search: { show: true },
          column: { show: true, width: 160, fixed: 'left' },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: '请输入物料描述' }],
          },
        },
        categoryId: {
          title: '类目',
          search: { show: true },
          column: { show: true, width: 160, fixed: 'left' },
          type: 'dict-select',
          valueResolve({ form, key }) {
            form.categoryIdList = form[key];
          },
          dict: dict({
            cache: true,
            // isTree: true,
            url: '/wms/metadata/material-categories/list',
            value: 'id',
            label: 'name',
          }),
          form: {
            component: {
              on: {
                selectedChange({ $event }) {
                  // utils.logger.info("onSelectedChange", $event);
                  // const labels = $event.map((item) => item.label);
                  // ui.message.info(`selected-change:${JSON.stringify(labels)}`);
                },
              },
            },
          },
        },
        brandId: brandTable(),
        unit: {
          title: '单位',
          type: 'text',
          column: { show: true, width: 120 },
          form: {
            helper: '基本计量单位(库内单位)',
            rules: [
              { required: true, message: '请输入基本计量单位(库内单位)' },
            ],
          },
        },
        spec: {
          title: '规格',
          type: 'textarea',
          search: { show: true },
          column: { show: true, width: 160, ellipsis: true },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: '请输入规格' }],
          },
        },
        model: {
          title: '型号',
          type: 'text',
          column: { show: true, width: 160 },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: '请输入型号' }],
          },
        },
        barCode: {
          title: '条码',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入条码' }],
          },
        },
        grossWeight: {
          title: '毛重',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入毛重' }],
          },
        },
        netWeight: {
          title: '净重',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入净重' }],
          },
        },
        length: {
          title: '长',
          type: 'text',
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入长' }],
          },
        },
        width: {
          title: '宽',
          type: 'text',
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入宽' }],
          },
        },
        height: {
          title: '高',
          type: 'text',
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入高' }],
          },
        },
        description: {
          title: '描述',
          type: 'textarea',
          column: { show: true, width: 160 },
          form: {
            col: { span: 24 },
          },
        },
        createName: {
          title: '创建人',
          type: 'text',
          form: { show: false },
          column: { ellipsis: true, width: 160 },
        },
        createTime: {
          title: '创建时间',
          type: ['datetime', 'wp-readonly-time'],
        },
      },
    },
  };
}
