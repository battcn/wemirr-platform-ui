import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import {
  compute,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  dict,
} from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';

const { t } = useI18n();

export default function ({
  crudExpose,
  context,
}: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const diagramRef = context.diagramRef;
  const approvalRef = context.approvalRef;
  const { notification, createConfirm } = useMessage();
  return {
    crudOptions: {
      table: {},
      request: {
        pageRequest: async (query: any) =>
          await defHttp.post({
            url: `/bpm/process_instances/page`,
            data: query,
          }),
      },
      actionbar: {
        show: true,
        buttons: {
          add: {
            show: false,
          },
        },
      },
      toolbar: {},
      rowHandle: {
        width: 200,
        buttons: {
          view: {
            order: 1,
            type: 'link',
            text: '流程图',
            async click({ row }) {
              await diagramRef.value.openPreview(row.procInstId);
            },
          },
          preview: {
            order: 0,
            type: 'link',
            text: '审核预览',
            async click({ row }) {
              await approvalRef.value.openPreview(row, crudExpose, true);
            },
          },
          edit: { size: 'small', show: false },
          remove: {
            type: 'link',
            text: t('bpm.process.table.buttons.cancelProcess'),
            size: 'middle',
            title: t('bpm.process.table.buttons.cancelProcess'),
            order: 0,
            show: compute(({ row }) => {
              return row.procInstStatus === 1 && row.procInstActivate;
            }),
            async click({ row }) {
              await defHttp
                .post({
                  url: `/bpm/process_instances/${row.procInstId}/cancel`,
                })
                .then(() => {
                  notification.success({ message: '作废成功', duration: 3 });
                  crudExpose.doRefresh();
                });
            },
          },
        },
      },
      columns: {
        id: {
          title: '流程实例扩展ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        procInstId: {
          title: t('bpm.process.table.columns.procInstId.title'),
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        procDefName: {
          title: t('bpm.process.table.columns.procDefName.title'),
          type: 'text',
          column: { width: 250, show: false },
          search: { show: false },
        },
        procDefKey: {
          title: t('bpm.process.table.columns.procDefKey.title'),
          type: 'text',
          column: { width: 250, show: false },
          search: { show: false },
        },
        procInstCategoryId: {
          title: '模型类别',
          type: 'dict-select',
          search: { show: true },
          dict: dict({
            url: '/bpm/process_categories/list',
            label: 'name',
            value: 'id',
          }),
          column: { show: false },
        },
        procInstCategoryName: {
          title: '流程类别',
          type: 'text',
          column: { width: 200, ellipsis: true },
        },
        procInstName: {
          title: t('bpm.process.table.columns.procInstName.title'),
          type: 'text',
          column: { width: 200, ellipsis: true },
          addForm: { show: false },
          editForm: { show: false },
          search: { show: true },
        },
        procInstActivate: {
          title: '激活状态',
          type: 'dict-switch',
          search: { show: true },
          column: {
            width: 120,
            align: 'center',
            component: {
              disabled: compute(({ row }) => {
                return row.procInstStatus !== 1 && row.procInstActivate;
              }),
              name: 'fs-dict-switch',
              vModel: 'checked',
            },
            valueChange: ({ value, row, record }) => {
              const status = row.procInstStatus;
              if (status !== 1) {
                record.procInstActivate = !value;
                return;
              }
              createConfirm({
                iconType: 'warning',
                title: '提示',
                content: `确定${row.procInstActivate ? '激活' : '挂起'}吗`,
                onOk: () => {
                  defHttp
                    .put({
                      url: `/bpm/process_instances/${row.id}/status/${row.procInstActivate}`,
                    })
                    .then(() => {
                      notification.success({
                        message: row.procInstActivate ? '激活成功' : '挂起成功',
                        duration: 2,
                      });
                    });
                },
                onCancel: () => {
                  row.procInstActivate = !value;
                },
              });
            },
          },
          dict: dict({
            data: [
              { value: true, label: '激活' },
              { value: false, label: '挂起' },
            ],
          }),
        },
        procInstVersion: {
          title: '流程版本',
          type: 'text',
          column: { width: 160 },
        },
        procInstStartTime: {
          title: t('bpm.process.table.columns.procInstStartTime.title'),
          column: { width: 170 },
          type: 'datetime',
        },
        procInstEndTime: {
          title: t('bpm.process.table.columns.procInstEndTime.title'),
          column: { width: 170 },
          type: 'datetime',
        },
        duration: {
          title: t('bpm.process.table.columns.duration.title'),
          type: 'text',
          column: { width: 100 },
        },
        createdName: {
          title: '发起人',
          type: 'text',
          column: { width: 160, align: 'center' },
        },
        procInstStatus: {
          title: t('bpm.process.table.columns.procInstStatus.title'),
          type: 'dict-radio',
          column: { fixed: 'right', width: 100, component: { color: 'auto' } },
          dict: dict({
            data: [
              { value: 'in_progress', label: '处理中', color: 'warning' },
              { value: 'done', label: '已完成', color: 'success' },
              { value: 'cancel', label: '已作废', color: 'error' },
            ],
          }),
        },
      },
    },
  };
}
