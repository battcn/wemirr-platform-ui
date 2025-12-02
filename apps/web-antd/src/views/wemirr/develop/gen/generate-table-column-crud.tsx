import type { CreateCrudOptionsRet } from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import * as api from './generate-table-column-api';

export default function crud(): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        pageRequest: api.GetPage,
        addRequest: api.AddObj,
        editRequest: api.UpdateObj,
        delRequest: api.DelObj,
      },
      mode: {
        name: 'local',
        isMergeWhenUpdate: true,
        isAppendWhenAdd: true,
      },
      table: {
        scroll: { fixed: true },
        editable: {
          enabled: false,
          mode: 'free',
          activeDefault: true,
          showAction: false,
        },
      },
      actionbar: {
        buttons: { add: { show: false } },
      },
      rowHandle: {
        width: 50,
        fixed: 'right',
        show: false,
        buttons: {
          view: { show: false },
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
        tableName: {
          title: '表名称',
          type: 'text',
          column: { width: 100, ellipsis: true, fixed: 'left' },
          search: { show: true },
        },
        name: {
          title: '字段名称',
          type: 'text',
          column: { width: 100, ellipsis: true, fixed: 'left' },
          form: {
            rules: [{ required: true, message: '请输入名称' }],
          },
        },
        sort: {
          title: '排序',
          type: 'text',
          column: { width: 100, ellipsis: true },
        },
        type: {
          title: '字段类型',
          type: 'text',
          column: { width: 100, ellipsis: true },
        },
        comment: {
          title: '注释',
          type: 'text',
          column: { width: 100, ellipsis: true },
        },
        propertyType: {
          title: '属性类型',
          type: 'text',
          column: { width: 100, ellipsis: true },
        },
        propertyName: {
          title: '属性类型',
          type: 'text',
          column: { width: 100, ellipsis: true },
        },
        propertyPackage: {
          title: '属性包',
          type: 'text',
          column: { width: 100, ellipsis: true },
        },
        pk: {
          title: '是否主键',
          column: { width: 120, ellipsis: true },
          type: ['dict-radio'],
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
        },
        increment: {
          title: '是否自增',
          column: { width: 120, ellipsis: true },
          type: ['dict-radio'],
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
        },
        required: {
          title: '是否必填',
          type: ['dict-radio'],
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
          column: { width: 120, ellipsis: true },
          form: {
            rules: [{ required: true, message: '必选' }],
          },
        },
        inserted: {
          title: '是否为新增',
          type: ['dict-radio'],
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
          column: { width: 140, ellipsis: true },
          form: {
            rules: [{ required: true, message: '必选' }],
          },
        },
        edit: {
          title: '是否编辑',
          type: ['dict-radio'],
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
          column: { width: 120, ellipsis: true },
          form: {
            rules: [{ required: true, message: '必选' }],
          },
        },
        list: {
          title: '是否列表展示',
          type: ['dict-radio'],
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
          column: { width: 120, ellipsis: true },
          form: {
            rules: [{ required: true, message: '必选' }],
          },
        },
        search: {
          title: '是否查询',
          type: ['dict-radio'],
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
          column: { width: 120, ellipsis: true },
          form: {
            rules: [{ required: true, message: '必选' }],
          },
        },
        searchCondition: {
          title: '查询条件',
          type: ['dict-select'],
          dict: dict({
            data: [
              { value: 'EQ', label: '精准', color: 'success' },
              { value: 'Like', label: '模糊', color: 'error' },
            ],
          }),
          column: { width: 120, ellipsis: true },
        },
        generate: {
          title: '是否需要生成',
          type: ['dict-radio'],
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
          column: { width: 120, ellipsis: true },
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
