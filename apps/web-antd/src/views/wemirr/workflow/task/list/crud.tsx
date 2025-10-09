import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';

export default function crud({
  crudExpose,
  context,
}: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const diagramRef = context.diagramRef;
  const approvalRef = context.approvalRef;
  return {
    crudOptions: {
      table: {},
      request: {
        pageRequest: async (query: any) =>
          await defHttp.post(`/workflow/process-tasks/page`, query),
        addRequest: async ({ form }: any) =>
          await defHttp.post(`/workflow/process-tasks`, form),
        editRequest: async ({ form }: any) =>
          await defHttp.put(`/workflow/process-tasks/${form.id}`, form),
        delRequest: async ({ row }: any) =>
          await defHttp.delete(`/workflow/process-tasks/${row.id}`),
      },
      toolbar: {},
      actionbar: {
        buttons: {
          add: {
            show: false,
          },
        },
      },
      rowHandle: {
        width: 180,
        buttons: {
          view: {
            order: 1,
            type: 'link',
            text: '流程图',
            async click({ row }) {
              await diagramRef.value.openPreview({
                procInstId: row.procInstId,
              });
            },
          },
          handle: {
            order: 0,
            type: 'link',
            text: '审批办理',
            async click({ row }) {
              await approvalRef.value.openPreview(row, crudExpose);
            },
          },
          edit: { show: false },
          remove: { show: false },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        procTaskId: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        procInstName: {
          title: '实例名',
          type: 'text',
          column: { width: 180 },
          search: { show: false },
        },
        procTaskName: {
          title: '任务名',
          type: 'text',
          column: { width: 230 },
          search: { show: true },
        },
        procCategoryName: {
          title: '流程类别',
          type: 'dict-select',
          column: { width: 120, component: { color: 'auto' } },
        },
        procDefName: {
          title: '流程定义名',
          type: 'dict-select',
          column: { width: 150, show: true, component: { color: 'auto' } },
          dict: dict({
            url: '/workflow/process-models/list',
            label: 'diagramName',
            value: 'diagramName',
          }),
          search: { show: true },
          form: {
            component: {
              showSearch: true,
              filterOption(inputValue, option) {
                return (
                  option.label.includes(inputValue) ||
                  option.value.includes(inputValue)
                );
              },
            },
          },
        },
        procInstStatus: {
          title: '状态',
          type: 'dict-radio',
          column: { width: 100, component: { color: 'auto' } },
          dict: dict({
            data: [
              { value: 'in_progress', label: '处理中', color: 'warning' },
              { value: 'done', label: '已完成', color: 'success' },
              { value: 'cancel', label: '已作废', color: 'error' },
            ],
          }),
        },
        createName: {
          title: '发起人',
          search: { show: false },
          type: 'text',
          addForm: { show: false },
          editForm: { show: false },
          column: { width: 170, ellipsis: true },
        },
        createTime: {
          title: '发起时间',
          type: 'datetime',
          column: { width: 170, align: 'center' },
          addForm: { show: false },
          editForm: { show: false },
          valueBuilder({ value, row, key }) {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
    },
  };
}
