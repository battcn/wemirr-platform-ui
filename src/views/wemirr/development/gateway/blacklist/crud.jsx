import * as api from './api';
import { ref } from 'vue';
import { compute, dict } from '@fast-crud/fast-crud';

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
        startTime: {
          title: '限制开始时间',
          type: 'time',
        },
        endTime: {
          title: '限制结束时间',
          type: 'time',
          // form: {
          //   col: { span: 24 }, // flex模式跨列配置
          //   labelCol: { span: 3 }, // antdv 跨列时，需要同时修改labelCol和wrapperCol
          //   wrapperCol: { span: 10 },
          // },
        },
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
