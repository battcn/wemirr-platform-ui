import type { CreateCrudOptionsRet } from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import * as templateApi from './generate-template-api';
import createCrudOptionsTemplate from './generate-template-crud';
import * as api from './generate-template-group-api';

export default function crud(): CreateCrudOptionsRet {
  const crudOptionsOverride = {
    rowHandle: { show: false },
    table: { scroll: { x: 2000 } },
  };

  return {
    crudOptions: {
      request: {
        pageRequest: api.GetPage,
        addRequest: api.AddObj,
        editRequest: api.UpdateObj,
        delRequest: api.DelObj,
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
        width: 150,
        align: 'center',
        fixed: 'right',
        buttons: {
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
        description: {
          title: '分组描述',
          type: 'text',
          column: { width: 200, ellipsis: true },
        },
        templateIds: {
          title: '模板',
          search: { show: false },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'name',
            getNodesByValues: async (_values: any[]) => {
              return await templateApi.GetList();
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
            width: 450,
            component: {
              labelFormatter: (item: any) => {
                return `${item.name}`;
              },
            },
          },
        },
        isDefault: {
          title: '是否默认',
          column: { width: 100, ellipsis: true },
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
          column: { width: 170 },
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
