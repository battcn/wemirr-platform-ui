import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';

import { compute } from '@fast-crud/fast-crud';
import { notification } from 'ant-design-vue';

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
          await defHttp.post(`/workflow/flow-instances/page`, query),
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
        width: 130,
        buttons: {
          view: {
            order: 1,
            type: 'link',
            text: '查看',
            async click({ row }) {
              await diagramRef.value.openPreview({ instanceId: row.id });
            },
          },
          preview: {
            order: 0,
            // 暂时没想好怎么做交互
            show: false,
            type: 'link',
            text: '审核预览',
            async click({ row }) {
              await approvalRef.value.openPreview(
                { ...row, instanceId: row.id },
                crudExpose,
                true,
              );
            },
          },
          edit: { size: 'small', show: false },
          remove: {
            type: 'link',
            text: '删除',
            size: 'middle',
            title: '删除',
            order: 0,
            show: compute(({ row }) => {
              return row.procInstStatus === 1 && row.procInstActivate;
            }),
            async click({ row }) {
              await defHttp
                .post(`/workflow/flow-instances/${row.procInstId}/cancel`)
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
        flowCode: {
          title: '流程编码',
          type: 'text',
          form: { show: false },
          column: { show: true },
        },
        flowName: {
          title: '流程名',
          type: 'text',
          column: { width: 250, show: true },
          search: { show: false },
        },
        businessCode: {
          title: '业务编码',
          type: 'text',
          column: { width: 250, show: false },
          search: { show: false },
        },
        categoryName: {
          title: '流程类别',
          type: 'text',
          column: { width: 200, ellipsis: true, component: { color: 'auto' } },
        },
        title: {
          title: '实例名称',
          type: 'text',
          column: { width: 200, ellipsis: true },
          addForm: { show: false },
          editForm: { show: false },
          search: { show: true },
        },
        version: {
          title: '流程版本',
          type: 'dict-radio',
          column: { width: 160, component: { color: 'auto' } },
        },
        // startTime: {
        //   title: '开始时间',
        //   column: { width: 170 },
        //   type: 'datetime',
        // },
        // endTime: {
        //   title: '结束时间',
        //   column: { width: 170 },
        //   type: 'datetime',
        // },
        // duration: {
        //   title: '耗时',
        //   type: 'text',
        //   column: { width: 100 },
        // },
        createName: {
          title: '发起人',
          type: 'text',
          column: { width: 160, align: 'center' },
        },
        createTime: {
          title: '创建时间',
          type: ['datetime', 'wp-readonly-time'],
        },
        // procInstStatus: {
        //   title: '状态',
        //   type: 'dict-radio',
        //   column: { fixed: 'right', width: 100, component: { color: 'auto' } },
        //   dict: dict({
        //     data: [
        //       { value: 'in_progress', label: '处理中', color: 'warning' },
        //       { value: 'done', label: '已完成', color: 'success' },
        //       { value: 'cancel', label: '已作废', color: 'error' },
        //     ],
        //   }),
        // },
      },
    },
  };
}
