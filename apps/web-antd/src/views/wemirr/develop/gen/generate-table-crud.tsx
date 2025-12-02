import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import * as api from './generate-table-api';
import * as groupApi from './generate-template-group-api';
import createCrudOptionsGroup from './generate-template-group-crud';

export default function (props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { showModalPre } = props.context;

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
          add: {
            show: false,
          },
        },
      },
      rowHandle: {
        width: 300,
        fixed: 'right',
        buttons: {
          view: { show: false },
          download: {
            type: 'link',
            text: '代码生成',
            size: 'small',
            title: '代码生成',
            async click(context) {
              await api.DownloadFile(context.row.id);
            },
          },
          preview: {
            type: 'link',
            text: '代码预览',
            size: 'small',
            title: '代码预览',
            click(context) {
              showModalPre(context.row.id);
            },
          },
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
          title: '表名',
          type: 'text',
          column: { width: 160, ellipsis: true },
          search: { show: true },

          editForm: {
            component: { disabled: true },
          },
        },
        comment: {
          title: '表描述',
          type: 'text',
          column: { width: 200, ellipsis: true },
        },
        packageName: {
          title: '包名',
          type: 'text',
          column: { width: 200 },
          form: {
            rules: [{ required: true, message: '包名不能为空' }],
          },
        },
        moduleName: {
          title: '模块名',
          type: 'text',
          column: { width: 200 },
          form: {
            rules: [{ required: true, message: '模块名不能为空' }],
          },
        },

        author: {
          title: '作者',
          type: 'text',
          column: { width: 150, ellipsis: true },
          form: {
            rules: [{ required: true, message: '作者不能为空' }],
            helper: '默认当前登录人昵称',
          },
        },
        businessName: {
          title: '业务名',
          type: 'text',
          column: { width: 200 },
          form: {
            rules: [{ required: true, message: '业务名不能为空' }],
          },
        },
        removePrefix: {
          title: '忽略前缀',
          addForm: { value: false },
          column: { show: true, width: 100 },
          type: ['dict-radio'],
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
          form: {
            rules: [{ required: true, message: '不能为空' }],
          },
        },
        prefix: {
          title: '前缀名',
          type: 'text',
          column: { width: 120 },
        },
        templateGroupId: {
          title: '模板组',
          search: { show: false },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'name',
            getNodesByValues: async (_values: any[]) => {
              return await groupApi.GetList();
            },
          }),
          form: {
            component: {
              crossPage: true,
              valuesFormat: {
                labelFormatter: (item: any) => {
                  return `${item.id}.${item.name}`;
                },
              },
              select: {
                placeholder: '点击选择',
              },
              createCrudOptions: createCrudOptionsGroup,
              crudOptionsOverride,
            },
          },
          column: {
            width: 150,
            component: {
              labelFormatter: (item: any) => {
                return `${item.name}`;
              },
            },
          },
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
