import dayjs from 'dayjs';

import { materialTable } from '#/views/wemirr/wms/table-select';

export default function ({ crudExpose, context }) {
  const isShowLine = context.isShowLine;
  return {
    crudOptions: {
      actionbar: {
        buttons: {
          add: { show: false },
          addRow: { show: true },
        },
      },
      search: { show: false },
      toolbar: {
        show: false,
        buttons: {
          refresh: { show: false },
          search: { show: false },
          export: { show: false },
        },
      },
      mode: {
        name: 'local',
        isMergeWhenUpdate: true,
        isAppendWhenAdd: true,
      },
      table: {
        editable: {
          enabled: true,
          mode: 'free',
          activeDefault: true,
          showAction: false,
        },
      },
      pagination: { show: false, pageSize: 9_999_999 },
      rowHandle: {
        width: 130,
        align: 'center',
        group: {
          editable: {
            // 行编辑模式
            edit: { size: 'small', type: 'link' },
            save: { size: 'small', type: 'link' }, // 保存
            cancel: { size: 'small', type: 'link' }, // 退出编辑
            remove: { size: 'small', type: 'link' },
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
        planItemNum: {
          title: '行号',
          type: 'number',
          column: { show: isShowLine, width: 80 },
          form: {
            component: { disabled: true },
          },
        },
        receivingNoticeItemNum: {
          title: '到货通知单行号',
          type: 'text',
          column: { show: true, width: 140 },
          form: {
            rules: [{ required: true, message: '请输入到货通知单行号' }],
          },
        },
        materialId: materialTable(),
        productionDate: {
          title: '生产日期',
          type: 'date',
          column: { show: true, width: 160 },
          valueResolve({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).unix();
            }
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
          form: {
            component: { format: 'YYYY-MM-DD', valueFormat: 'YYYY-MM-DD' },
            rules: [{ required: true, message: '请输入生产日期' }],
          },
        },
        expiryDate: {
          title: '失效日期',
          type: 'date',
          column: { show: true, width: 160 },
          valueResolve({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).unix();
            }
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
          form: {
            component: { format: 'YYYY-MM-DD', valueFormat: 'YYYY-MM-DD' },
            rules: [{ required: true, message: '请输入失效日期' }],
          },
        },
        batchNum: {
          title: '供应商批次号',
          type: 'text',
          column: { show: true, width: 140 },
          form: {
            // 表单配置
            rules: [{ required: true, message: '请输入批次号' }],
          },
        },
        qty: {
          title: '收货计划数量',
          type: 'number',
          column: {
            show: true,
            width: 140,
            formatter({ value, row }) {
              return `${value}(${row.unit})`;
            },
          },
          form: {
            rules: [{ required: true, message: '请输入数量' }],
          },
        },
        completeQty: {
          title: '可收/收货中/收货完成',
          type: 'number',
          column: {
            show: true,
            width: 160,
            column: { show: isShowLine, width: 80 },
            formatter({ row }) {
              return `${row.qty - (row.completeQty + row.progressQty)} / ${
                row.progressQty
              } / ${row.completeQty} (${row.unit})`;
            },
          },
          form: {
            component: { disabled: true },
          },
        },
        unit: {
          title: '单位',
          type: 'text',
          column: { show: true, width: 140 },
          form: {
            // 表单配置
            rules: [{ required: true, message: '请输入单位' }],
          },
        },
        unitPrice: {
          title: '单位价格',
          type: 'number',
          column: { show: true, width: 140 },
          form: {
            // 表单配置
            rules: [{ required: true, message: '请输入单位价格' }],
          },
        },
      },
    },
  };
}
