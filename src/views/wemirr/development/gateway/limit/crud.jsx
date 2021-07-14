import * as api from './api';
import { compute, dict, utils } from '@fast-crud/fast-crud';
import moment from 'moment';

export default function ({ expose }) {
  const pageRequest = async (query) => {
    return await api.GetList(query).then((ret) => {
      return ret.data;
    });
  };
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.id);
  };

  const addRequest = async ({ form }) => {
    return await api.AddObj(form);
  };
  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        type: {
          title: '类型',
          type: 'dict-select',
          search: { show: true },
          dict: dict({
            data: [
              { label: '秒', value: 1, color: 'success' },
              { label: '分', value: 2, color: 'success' },
              { label: '时', value: 3, color: 'success' },
              { label: '天', value: 4, color: 'success' },
            ],
          }),
          form: {
            value: 1,
            rules: [{ required: true, message: '限流类型不能为空' }],
          },
        },
        range: {
          title: '范围',
          type: 'dict-select',
          search: { show: true },
          dict: dict({
            data: [
              { label: '全局', value: 0, color: 'success' },
              { label: 'IP', value: 1, color: 'success' },
            ],
          }),
          form: {
            value: 0,
            rules: [{ required: true, message: '限流类型不能为空' }],
            helper: '全局表示所有IP访问,IP表示每隔间断访问',
          },
        },
        total: {
          title: '数量',
          type: 'number',
          column: { show: true },
          form: {
            value: 10,
            component: {
              min: 10,
              max: 9999999,
            },
            rules: [{ required: true, message: '限流数量不能为空' }],
          },
        },
        visits: {
          title: '访问量',
          type: 'number',
          column: { show: true },
          form: { show: false },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          addForm: {
            value: true,
          },
          search: { show: true },
          dict: dict({
            data: [
              { value: true, label: '启用', color: 'success' },
              { value: false, label: '禁用', color: 'error' },
            ],
          }),
        },
        blacklist: {
          title: '进黑名单',
          type: 'dict-radio',
          addForm: {
            value: true,
          },
          search: { show: true },
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
        },
        method: {
          title: '方法',
          type: 'dict-select',
          search: { show: true },
          dict: dict({
            data: [
              { label: 'ALL', value: 'ALL', color: 'success' },
              { label: 'GET', value: 'GET', color: 'success' },
              { label: 'POST', value: 'POST', color: 'success' },
              { label: 'PUT', value: 'PUT', color: 'success' },
              { label: 'DELETE', value: 'DELETE', color: 'error' },
              { label: 'PATCH', value: 'PATCH', color: 'success' },
            ],
          }),
          form: {
            rules: [{ required: true, message: '请选择拦截方法' }],
          },
        },
        path: {
          title: '路径',
          type: 'text',
          form: {
            helper: '如果为空默认拦截所有',
          },
          column: {
            ellipsis: true,
          },
        },
        dateTimeRange: {
          title: '限时范围',
          type: 'datetimerange',
          valueBuilder({ row, key }) {
            if (!utils.strings.hasEmpty(row.startTime, row.endTime)) {
              row[key] = [moment(row.startTime), moment(row.endTime)];
            }
          },
          valueResolve({ form, key }) {
            const row = form;
            if (row[key] != null && !utils.strings.hasEmpty(row[key])) {
              row.startTime = row[key][0];
              row.endTime = row[key][1];
            } else {
              row.startTime = null;
              row.endTime = null;
            }
          },
          form: {
            col: { span: 24 },
            labelCol: { span: 2 },
            wrapperCol: { span: 21 },
          },
        },
        description: {
          title: '描述',
          type: 'textarea',
          search: { show: false, labelCol: { span: 4 } },
          form: {
            col: { span: 24 },
            labelCol: { span: 2 },
            wrapperCol: { span: 21 },
          },
          column: {
            ellipsis: true,
          },
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          form: { show: false },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = moment(value);
            }
          },
        },
      },
    },
  };
}
