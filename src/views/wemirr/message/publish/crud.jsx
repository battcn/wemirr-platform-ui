import * as api from './api';
import { useMessage } from '/@/hooks/web/useMessage';
import { compute, dict } from '@fast-crud/fast-crud';

export default function ({ expose, searchRemote }) {
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

  const { notification } = useMessage();
  const { fetchReceiver, searchState } = searchRemote;

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      toolbar: {},
      rowHandle: {
        width: 200,
        buttons: {
          publish: {
            icon: 'codicon:repo-force-push',
            type: 'link',
            text: null,
            size: 'small',
            order: 4,
            async click(context) {
              console.log(context);
              await api.PublishMessage(context.row.id).then((ret) => {
                notification.success({
                  message: '消息通知成功',
                  duration: 3,
                });
              });
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
        type: {
          title: '接收类型',
          search: { show: true },
          column: { show: true, align: 'center' },
          type: 'dict-radio',
          dict: dict({
            data: [
              { value: 1, label: '个人', color: 'success' },
              { value: 2, label: '角色', color: 'error' },
            ],
          }),
          form: {
            valueChange: ({ value, form, ...content }) => {
              console.log('value', value, 'form', form, 'content', content);
              fetchReceiver(value, '');
            },
          },
          addForm: {
            value: 1,
          },
        },
        receiver: {
          title: '接收者',
          column: { show: false },
          form: {
            component: {
              mode: 'multiple',
              name: 'a-select',
              vModel: 'value',
              filterOption: false,
              showSearch: true,
              allowClear: true,
              placeholder: '请输入搜索内容',
              options: searchState.data,
              onSearch: compute(({ form }) => {
                if (!form.type) {
                  return '暂无记录';
                }
                console.log('form', form.type);
                return function (value) {
                  fetchReceiver(form.type, value);
                };
              }),
              children: {
                notFoundContent() {
                  if (searchState.fetching.value) {
                    return <a-spin size="small" />;
                  }
                  return '暂无记录';
                },
              },
            },
          },
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
        description: {
          title: '描述信息',
          type: 'textarea',
          column: {
            ellipsis: true,
          },
          form: {
            col: { span: 24 },
            labelCol: { span: 2 },
            wrapperCol: { span: 21 },
          },
        },
        createdName: {
          title: '发布人',
          type: 'text',
          column: { show: false },
          form: { show: false },
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
