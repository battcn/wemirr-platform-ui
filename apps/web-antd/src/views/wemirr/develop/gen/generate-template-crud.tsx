import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';

import dayjs from 'dayjs';

import * as api from './generate-template-api';

export default function crud(
  props: CreateCrudOptionsProps,
): CreateCrudOptionsRet {
  const { showEditModal, showViewModal } = props.context;

  return {
    crudOptions: {
      request: {
        pageRequest: api.GetPage,
        addRequest: api.AddObj,
        editRequest: api.UpdateObj,
        delRequest: api.DelObj,
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
        width: 150,
        fixed: 'right',
        align: 'center',
        buttons: {
          view: {
            async click(context) {
              showViewModal(context.row.id);
            },
          },
          edit: {
            async click(context) {
              showEditModal(context.row.id);
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
          title: '模板名称',
          type: 'text',
          column: { width: 160, ellipsis: true },
          search: { show: true },
        },
        generatePath: {
          title: '模板路径',
          type: 'text',
          column: { width: 160, ellipsis: true },
        },
        description: {
          title: '模板描述',
          type: 'text',
          column: { width: 160, ellipsis: true },
        },
        createName: {
          title: '创建人',
          type: 'text',
          column: { width: 160, ellipsis: true },
        },
        createTime: {
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
