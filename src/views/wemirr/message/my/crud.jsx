import * as api from './api';
import { request } from '/src/api/service';
import { dict } from '@fast-crud/fast-crud';

export default function ({ expose }) {
  const pageRequest = async (query) => {
    return await api.GetList(query).then((ret) => {
      return ret.data;
    });
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.id);
  };
  return {
    crudOptions: {
      request: {
        pageRequest,
        delRequest,
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        title: {
          title: '标题',
          type: 'text',
          search: { show: true },
        },
        code: {
          title: '类型',
          type: 'dict-select',
          column: { show: true, align: 'center' }, // 表单配置
          dict: dict({
            url: '/authority/dictionaries/NOTICE/list',
            label: 'name',
            onReady: ({ dict }) => {
              dict.data.forEach((item) => {
                item.color = item.value === '1' ? 'warning' : 'success';
              });
            },
          }),
        },
        mark: {
          title: '状态',
          column: { show: true, align: 'center' }, // 表单配置
          type: 'dict-radio',
          dict: dict({
            data: [
              { value: true, label: '已读', color: 'success' },
              { value: false, label: '未读', color: 'error' },
            ],
          }),
        },
        content: {
          title: '消息内容',
          type: 'textarea',
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
