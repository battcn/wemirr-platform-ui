import { ref } from 'vue';
import { dict } from '@fast-crud/fast-crud';
import moment from 'moment';
import { GET, DELETE } from '/src/api/service';

export default function ({ expose }) {
  const selectedRowKeys = ref([]);

  const onSelectChange = (changed) => {
    selectedRowKeys.value = changed;
  };

  return {
    selectedRowKeys,
    crudOptions: {
      table: {
        rowSelection: {
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        },
      },
      request: {
        pageRequest: async (query) => await GET(`/authority/station_messages/my`, query),
        delRequest: async ({ row }) => await DELETE(`/authority/station_messages/my/${row.id}`),
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
          type: 'editor-wang',
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
