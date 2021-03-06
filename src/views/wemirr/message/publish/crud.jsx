import * as api from './api';
import { useMessage } from '/@/hooks/web/useMessage';
import { compute, dict } from '@fast-crud/fast-crud';
import moment from 'moment';

export default function ({ expose, searchRemote }) {
  const { notification } = useMessage();
  const { fetchReceiver, searchState } = searchRemote;
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await api.GetList(query),
        addRequest: async ({ form }) => await api.AddObj(form),
        editRequest: async ({ form }) => await api.UpdateObj(form),
        delRequest: async ({ row }) => await api.DelObj(row.id),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {
          add: {
            icon: 'codicon:repo-force-push',
            text: '发布消息',
          },
        },
      },
      rowHandle: {
        width: 220,
        buttons: {
          publish: {
            icon: 'codicon:repo-force-push',
            type: 'link',
            text: null,
            size: 'small',
            title: '通知',
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
              name: 'a-select',
              vModel: 'value',
              filterOption: false,
              mode: 'multiple',
              showSearch: true,
              allowClear: true,
              placeholder: '请输入搜索内容',
              options: searchState.data,
              onSearch: compute(({ form }) => {
                if (!form.type) {
                  return '暂无记录';
                }
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
          type: ['editor-wang', 'colspan'],
          column: {
            ellipsis: true,
          },
          viewForm: {
            disabled: true,
          },
          form: {
            component: {
              // disabled: true,
              uploader: {
                type: 'form', // 上传后端类型【cos,aliyun,oss,form】
                buildUrl(res) {
                  return 'http://www.docmirror.cn:7070' + res.url;
                },
              },
              on: {
                'text-change': (event) => {
                  console.log('text-change:', event);
                },
              },
            },
          },
        },
        description: {
          title: '描述信息',
          type: 'textarea',
          column: { ellipsis: true },
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
