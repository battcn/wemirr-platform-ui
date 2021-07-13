import * as api from './api';
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
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {
          add: {
            show: false,
          },
        },
      },
      rowHandle: {
        buttons: {
          edit: { show: false },
        },
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
        level: {
          title: '级别',
          type: 'dict-select',
          search: { show: true },
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
          search: { show: true },
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
          type: 'editor-quill',
          column: {
            ellipsis: true,
          },
          form: {
            col: { span: 24 },
            labelCol: { span: 2 },
            wrapperCol: { span: 21 },
          },
        },
        createdTime: {
          title: '通知时间',
          type: 'datetime',
          form: { show: false },
        },
      },
    },
  };
}
