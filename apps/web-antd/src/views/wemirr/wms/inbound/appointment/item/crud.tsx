import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

export default function crud(
  props: CreateCrudOptionsProps,
): CreateCrudOptionsRet {
  return {
    crudOptions: {
      actionbar: {
        buttons: {
          add: {
            show: false,
          },
          addRow: {
            show: true,
          },
        },
      },
      search: {
        show: false,
      },
      toolbar: {
        buttons: {
          refresh: {
            show: false,
          },
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
      columns: {
        id: {
          title: 'ID',
          type: 'number',
          form: { show: false },
          column: { show: false, width: 80, align: 'center' },
        },
        goodsName: {
          title: '货物名称',
          type: 'text',
          column: { width: 120 },
          form: {
            rules: [
              { required: true, message: '请填写货物名称' },
              { min: 1, max: 1000, message: '长度在 2 到 1000 个字符' },
            ],
          },
        },
        quantity: {
          title: '数量',
          type: 'number',
          column: { width: 120 },
          form: {
            component: { min: 1, max: 99_999_999 },
            rules: [{ required: true, message: '请填写数量' }],
          },
        },
        brand: {
          title: '品牌',
          type: 'text',
          column: { width: 120 },
        },
        spec: {
          title: '规格',
          type: 'text',
          column: { width: 120 },
        },
        model: {
          title: '型号',
          type: 'text',
          column: { width: 120 },
        },
        dangerous: {
          title: '危险品',
          type: 'dict-select',
          column: { width: 150 },
          dict: dict({
            data: [
              { value: false, label: '否', color: 'success' },
              { value: true, label: '是', color: 'error' },
            ],
          }),
        },
        manufactureDate: {
          title: '生产日期',
          type: 'datetime',
          column: { width: 200 },
          form: {
            rules: [{ required: true, message: '生产日期不能为空' }],
          },
          editForm: {
            component: {
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
            },
          },
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
        },
        batchNo: {
          title: '生产批次',
          type: 'text',
          column: { width: 120 },
        },
      },
    },
  };
}
