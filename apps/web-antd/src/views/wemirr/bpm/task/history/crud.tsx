import { useRouter } from 'vue-router';

import { useI18n } from '@/hooks/web/useI18n';
import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';

export default function () {
  const { t } = useI18n();
  const router = useRouter();
  return {
    t,
    crudOptions: {
      table: {},
      request: {
        pageRequest: async (query: any) =>
          await defHttp.post({
            url: `/bpm/process_tasks/history`,
            data: query,
          }),
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
              await router.push(
                `/bpm/task/list/complete?procInstId=${row.procInstId}&taskId=${row.procTaskId}&type=view`,
              );
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
          title: t('bpm.task.table.columns.procInstName.title'),
          type: 'text',
          addForm: { show: false },
          editForm: { show: false },
          column: { width: 200 },
          search: { show: true },
        },
        procTaskName: {
          title: t('bpm.task.table.columns.taskName.title'),
          type: 'text',
          addForm: { show: false },
          editForm: { show: false },
          column: { width: 260, ellipsis: true },
          search: { show: true },
        },
        procInstCategoryName: {
          title: t('bpm.task.table.columns.processCategoryId.title'),
          type: 'text',
          column: { width: 180, component: { color: 'auto' } },
        },
        procDefName: {
          title: t('bpm.task.table.columns.definitionId.title'),
          type: 'dict-select',
          column: {
            width: 200,
            component: {
              color: 'auto',
            },
          },
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
        procInstVersion: {
          title: '流程版本',
          type: 'text',
          column: { width: 100 },
        },
        taskInstStartTime: {
          title: t('bpm.task.table.columns.taskInstanceStartTime.title'),
          type: 'datetime',
          column: { width: 170, align: 'center' },
          addForm: { show: false },
          editForm: { show: false },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
        },
        taskInstEndTime: {
          title: t('bpm.task.table.columns.taskInstanceEndTime.title'),
          type: 'datetime',
          column: { width: 170, align: 'center' },
          addForm: { show: false },
          editForm: { show: false },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
        },
        procInstStatus: {
          title: t('bpm.task.table.columns.processInstStatus.title'),
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
