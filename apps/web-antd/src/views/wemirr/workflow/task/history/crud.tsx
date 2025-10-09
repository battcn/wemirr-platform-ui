import { dict, useUi } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';

export default function crud() {
  const { ui } = useUi();
  // const router = useRouter();
  return {
    crudOptions: {
      table: {},
      request: {
        pageRequest: async (query: any) =>
          await defHttp.post(`/workflow/process-tasks/history`, query),
      },
      toolbar: {},
      rowHandle: {
        width: 90,
        buttons: {
          add: { show: false },
          remove: { show: false },
          edit: { show: false },
          view: {
            type: 'link',
            async click({ row }) {
              ui.notification.error('暂未实现');
              // await router.push(`/workflow/task/list/complete?procInstId=${row.procInstId}&taskId=${row.procTaskId}&type=view`,);
            },
          },
        },
      },
      actionbar: {
        show: true,
        buttons: {
          add: {
            show: false,
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
        procInstName: {
          title: '流程实例名',
          type: 'text',
          addForm: { show: false },
          editForm: { show: false },
          column: { width: 200 },
          search: { show: true },
        },
        procTaskName: {
          title: '流程任务名',
          type: 'text',
          addForm: { show: false },
          editForm: { show: false },
          column: { width: 260, ellipsis: true },
          search: { show: true },
        },
        procInstCategoryName: {
          title: '实例类别名',
          type: 'text',
          column: { width: 180, component: { color: 'auto' } },
        },
        procDefName: {
          title: '流程定义名',
          type: 'dict-select',
          column: {
            width: 200,
            component: {
              color: 'auto',
            },
          },
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
        procInstVersion: {
          title: '流程版本',
          type: 'text',
          column: { width: 100 },
        },
        taskInstStartTime: {
          title: '任务开始时间',
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
        taskInstEndTime: {
          title: '任务完成时间',
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
        procInstStatus: {
          title: '状态',
          type: 'dict-radio',
          column: { width: 100, fixed: 'right', component: { color: 'auto' } },
          dict: dict({
            data: [
              { value: 'in_progress', label: '处理中', color: 'warning' },
              { value: 'done', label: '已完成', color: 'success' },
              { value: 'cancel', label: '已作废', color: 'error' },
            ],
          }),
        },
        initiatorName: {
          title: '发起人',
          type: 'text',
          column: { width: 150, fixed: 'right' },
        },
        approverName: {
          title: '审批人',
          type: 'text',
          column: { width: 150, fixed: 'right' },
        },
      },
    },
  };
}
