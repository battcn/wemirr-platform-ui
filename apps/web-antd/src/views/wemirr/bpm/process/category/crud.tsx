import { useI18n } from '@/hooks/web/useI18n';
import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';

const { t } = useI18n();

export default function () {
  return {
    crudOptions: {
      table: {},
      request: {
        pageRequest: async (query: any) =>
          await defHttp.post({
            url: `/bpm/process_categories/page`,
            data: query,
          }),
        addRequest: async ({ form }: any) =>
          await defHttp.post({
            url: `/bpm/process_categories/create`,
            data: form,
          }),
        editRequest: async ({ form }: any) =>
          await defHttp.put({
            url: `/bpm/process_categories/${form.id}`,
            data: form,
          }),
        delRequest: async ({ row }: any) =>
          await defHttp.delete({ url: `/bpm/process_categories/${row.id}` }),
      },
      toolbar: {},
      rowHandle: {},
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        code: {
          title: t('bpm.category.table.columns.code.title'),
          type: 'text',
          editForm: { component: { disabled: true } },
          column: { width: 150 },
          search: { show: true },
          form: {
            rules: [{ required: true, message: '编码不能为空' }],
          },
        },
        icon: {
          title: 'ICON',
          type: 'text',
          column: {
            width: 100,
            align: 'center',
            component: {
              name: 'fs-icon',
              vModel: 'icon',
              style: 'font-size:20px',
            },
          },
          form: {
            rules: [{ required: true, message: 'ICON 不能为空' }],
            helper: {
              render() {
                return (
                  <a
                    href={'https://iconify.design/icon-sets/ion/'}
                    target={'_blank'}
                  >
                    无满意的 ICON ? 请点我
                  </a>
                );
              },
            },
          },
        },
        name: {
          title: t('bpm.category.table.columns.name.title'),
          type: 'text',
          column: { width: 200 },
          search: { show: true },
          form: {
            rules: [{ required: true, message: '名称不能为空' }],
          },
        },
        status: {
          title: t('bpm.category.table.columns.state.title'),
          type: 'dict-radio',
          column: { width: 100, align: 'center' },
          search: { show: true },
          dict: dict({
            data: [
              {
                value: 1,
                label: t('bpm.category.table.columns.state.dict.enable'),
                color: 'success',
              },
              {
                value: 0,
                label: t('bpm.category.table.columns.state.dict.disable'),
                color: 'error',
              },
            ],
          }),
          addForm: { value: 1 },
        },
        description: {
          title: t('bpm.category.table.columns.description.title'),
          search: { show: false },
          column: { ellipsis: true },
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
          search: { show: false },
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
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
    },
  };
}
