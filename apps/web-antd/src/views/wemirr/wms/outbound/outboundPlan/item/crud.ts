import { compute, dict } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';
import unitCrudOptions from '#/views/wemirr/wms/metadata/unit/crud';
import { materialTable } from '#/views/wemirr/wms/table-select';

export default function crud({ context }) {
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
            // 手动分配库存
            allocation: {
              type: 'link',
              text: '手动分配库存',
              size: 'small',
              title: '手动分配库存',
              order: 1,
            },
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
          column: { show: isShowLine, width: 40 },
          form: {
            component: { disabled: true },
          },
        },
        materialId: materialTable(),
        qty: {
          title: '计划数量',
          type: 'number',
          column: {
            show: true,
            width: 80,
            formatter({ value }: any) {
              return value;
            },
          },
          form: {
            rules: [{ required: true, message: '请输入数量' }],
          },
        },
        unit: {
          title: '计量单位',
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'name',
            getNodesByValues: async (values: any[]) => {
              return await defHttp.post('/wms/metadata/units/ids', values);
            },
          }),
          column: { show: true, width: 60 },
          form: {
            rules: [{ required: true, message: '请选择计量单位' }],
            show: compute(({ form }) => {
              return form.name;
            }),
            component: {
              crossPage: true,
              createCrudOptions: unitCrudOptions,
            },
          },
        },
        remark: {
          title: '备注',
          type: 'textarea',
          search: { show: false },
          column: { show: true, width: 140 },
        },
        allocationQty: {
          title: '已分配的库存数量',
          type: 'text',
          column: {
            show: true,
            width: 110,
            column: { show: isShowLine, width: 80 },
            formatter({ row }: any) {
              return `${row.completeQty + row.progressQty} (${row.unit})`;
            },
          },
          form: {
            component: { disabled: true },
          },
        },
        completeQty: {
          title: '待分配/拣货中/拣货完成',
          type: 'text',
          column: {
            show: true,
            width: 140,
            column: { show: isShowLine, width: 80 },
            formatter({ row }: any) {
              return `${row.qty - (row.completeQty + row.progressQty)} / ${
                row.progressQty
              } / ${row.completeQty} (${row.unit})`;
            },
          },
          form: {
            component: { disabled: true },
          },
        },
      },
    },
  };
}
