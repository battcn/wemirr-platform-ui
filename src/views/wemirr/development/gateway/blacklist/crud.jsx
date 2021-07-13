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
        ip: {
          title: 'IP',
          type: 'text',
          search: { show: true },
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
        method: {
          title: '方法',
          type: 'dict-select',
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
            value: 'ALL',
            rules: [{ required: true, message: '请选择拦截方法' }],
          },
        },
        datetimerange: {
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
        },
        // startTime: {
        //   title: '开始时间',
        //   type: 'time',
        //   form: {
        //     col: { span: 12 },
        //     labelCol: { span: 4 },
        //     wrapperCol: { span: 5 },
        //   },
        // },
        // endTime: {
        //   title: '结束时间',
        //   type: 'time',
        //   form: {
        //     labelCol: { span: 4 },
        //     wrapperCol: { span: 9 },
        //   },
        // },
        description: {
          title: '描述',
          type: 'textarea',
          search: { show: false, labelCol: { span: 4 } },
          form: {
            show: compute((context) => {
              // grid跨列模式下使用flex模式的设置会显示异常，为了演示效果，在grid模式下隐藏
              return context.form.display !== 'grid';
            }),
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
        },
      },
    },
  };
}
