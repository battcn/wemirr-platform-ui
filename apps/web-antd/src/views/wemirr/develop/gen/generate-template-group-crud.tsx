// import { downloadByData } from '@/utils/file/download';
import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';

import createCrudOptionsTemplate from './generate-template-crud';

export default function (props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const {} = props.context;

  const pageRequest = async (query: any) =>
    await defHttp.get('/suite/generate-template-group/page', {
      params: query,
    });

  const editRequest = async ({ form }: any) =>
    await defHttp.put(`/suite/generate-template-group/${form.id}/modify`, form);
  const delRequest = async ({ row }: any) =>
    await defHttp.delete(`/suite/generate-template-group/${row.id}`);
  const addRequest = async ({ form }: any) =>
    await defHttp.post('/suite/generate-template-group/create', form);

  const crudOptionsOverride = {
    table: {
      scroll: {
        x: 2000,
      },
    },
    rowHandle: {
      show: false,
      // width: 260,
      // fixed: 'right',
      buttons: {
        view: {
          show: false,
        },
        edit: {
          show: false,
        },

        remove: { show: false },
      },
    },
  };
  return {
    crudOptions: {
      request: {
        pageRequest,
        editRequest,
        delRequest,
        addRequest,
      },
      table: {
        scroll: { fixed: true },
      },
      actionbar: {
        buttons: {
          add: {},
        },
      },
      rowHandle: {
        width: 260,
        fixed: 'right',
        buttons: {
          view: {},
          edit: {},

          remove: { order: 2 },
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
          title: '模板分组',
          type: 'text',
          column: { width: 160, ellipsis: true },
          search: { show: true },
          form: {
            rules: [{ required: true, message: '分组名称不能为空' }],
          },
        },
        desciption: {
          title: '分组描述',
          type: 'text',
          column: { width: 160, ellipsis: true },
        },
        templateIds: {
          title: '模板',
          search: { show: false },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'name',
            getNodesByValues: async (values: any[]) => {
              console.log('getNodesByValues', values);
              return await defHttp.get('/suite/generate-template/list-all', {});
            },
          }),
          form: {
            component: {
              crossPage: true,
              multiple: true,
              valuesFormat: {
                labelFormatter: (item: any) => {
                  return `${item.name}`;
                },
              },
              select: {
                placeholder: '点击选择',
              },
              createCrudOptions: createCrudOptionsTemplate,
              crudOptionsOverride,
            },
            rules: [{ required: true, message: '模板不能为空' }],
          },
          column: {
            component: {
              labelFormatter: (item: any) => {
                return `${item.name}`;
              },
            },
          },
        },
        isDefault: {
          title: '是否默认模板组',
          column: { width: 160, ellipsis: true },
          type: ['dict-radio'],
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
        },
        createTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 180 },
          form: { show: false },
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
