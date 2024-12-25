import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';

import { useRouter } from 'vue-router';

import { dict } from '@fast-crud/fast-crud';
import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';

export default function ({
  crudExpose,
  context,
}: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const router = useRouter();
  const diagramRef = context.diagramRef;
  const approvalRef = context.approvalRef;
  return {
    crudOptions: {
      table: {},
      request: {
        pageRequest: async (query: any) =>
          await defHttp.post(`/bpm/process_tasks/page`, query),
        addRequest: async ({ form }: any) =>
          await defHttp.post(`/bpm/process_tasks`, form),
        editRequest: async ({ form }: any) =>
          await defHttp.put(`/bpm/process_tasks/${form.id}`, form),
        delRequest: async ({ row }: any) =>
          await defHttp.delete(`/bpm/process_tasks/${row.id}`),
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
          edit: {
            show: false,
            order: 1,
            type: 'link',
            text: '编辑',
            async click({ row }) {
              await router.push(
                `/bpm/task/list/complete?procInstId=${row.procInstId}&taskId=${row.procTaskId}&type=complete`,
              );
            },
          },
          updateAssignee: {
            order: 2,
            type: 'link',
            show: false,
            text: '转办',
            async click(context) {
              await defHttp
                .post(`/bpm/design_models/${context.row.id}/deploy`)
                .then(() => {
                  notification.success({ message: '任务已转办', duration: 3 });
                  crudExpose.doRefresh();
                });
            },
          },
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
            url: '/bpm/process_models/list',
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
        createdName: {
          title: '发起人',
          search: { show: false },
          type: 'text',
          addForm: { show: false },
          editForm: { show: false },
          column: { width: 170, ellipsis: true },
        },
        createdTime: {
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
