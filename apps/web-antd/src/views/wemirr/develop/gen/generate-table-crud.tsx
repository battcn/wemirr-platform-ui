import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';
import {  dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';
import { defHttp } from '#/api/request';
import createCrudOptionsGroup from './generate-template-group-crud';

export default function (props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { showModalPre } = props.context;

  const pageRequest = async (query: any) =>
    await defHttp.get('/suite/gennerate-table/page', { params: query });

  const editRequest = async ({ form }: any) =>
    await defHttp.put(`/suite/gennerate-table/${form.id}/modify`, form);
  const delRequest = async ({ row }: any) =>
    await defHttp.delete(`/suite/gennerate-table/${row.id}`);
  const addRequest = async ({ form }: any) =>
    await defHttp.post('/suite/gennerate-table', form);
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
          add: {
            show: false,
          },
        },
      },
      rowHandle: {
        width: 260,
        fixed: 'right',
        buttons: {
          view: {
            show: false,
          },
          download: {
            // icon: "ant-design:cloud-download-outlined",
            type: 'link',
            text: '代码生成',
            size: 'small',
            title: '代码生成',
            async click(context) {
              await defHttp.downloadFile(
                `/suite/gennerate-table/${context.row.id}/generate`,
                `generated-table.zip`,
                {
                  method: 'POST',
                },
              );
          },
        },
          preview: {
            // icon: "ant-design:cloud-download-outlined",
            type: 'link',
            text: '代码预览',
            size: 'small',
            title: '代码预览',
            async click(context) {
              await defHttp
                .request(`/suite/gennerate-table/${context.row.id}/preview`, {
                  method: 'GET',
                })
                .then((res) => {
                  showModalPre(context.row.id);
                  console.log('预览结果', res);
                });
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
          column: { width: 160, ellipsis: true },
        },
        packageName: {
          title: '包名',
          type: 'text',
          column: { width: 120 },
          form: {
            rules: [{ required: true, message: '包名不能为空' }],
          },
        },
        moduleName: {
          title: '模块名',
          type: 'text',
          column: { width: 120 },
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
          column: { width: 120 },
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
            getNodesByValues: async (values: any[]) => {
              console.log('templateIds', values);
              const res = await defHttp.get(
                '/suite/gennerate-template-group/list-all',
                {},
              );
              console.log('templateIds', res);
              return res;
            },
          }),
          form: {
            // show: compute(({ form }) => {
            //   return form.dynamicShow;
            // }),
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
              crudOptionsOverride: crudOptionsOverride,
              on: {
                selectedChange({ $event }) {
                  console.log('selectedChange', $event);
                  console.log(`你选择了${JSON.stringify($event)}`);
                },
              },
            },
          },
          column: {
            width: 120,
            component: {
              labelFormatter: (item: any) => {
                return `${item.name}`;
              },
            },
          },
        },
        createdTime: {
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


