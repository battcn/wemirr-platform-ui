import * as api from './api';
import { request } from '/src/api/service';
import { compute, dict } from '@fast-crud/fast-crud';
import { ref } from 'vue';
import _ from 'lodash-es';
import moment from "moment";

function useSearchRemote() {
  let lastFetchId = 0;
  const state = {
    data: ref([]),
    fetching: ref(false),
  };
  const fetchReceiver = _.debounce((value) => {
    lastFetchId += 1;
    const fetchId = lastFetchId;
    state.data.value = [];
    state.fetching.value = true;
    fetch('https://randomuser.me/api/?results=5')
      .then((response) => response.json())
      .then((body) => {
        if (fetchId !== lastFetchId) {
          console.log('fetchId', fetchId, 'lastFetchId', lastFetchId);
          return;
        }
        const data = body.results.map((user) => ({
          text: user.gender,
          value: user.gender,
        }));
        console.log('data', data);
        state.data.value = data;
        state.fetching.value = false;
      });
  }, 500);

  return {
    fetchReceiver,
    searchState: state,
  };
}

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

  const { fetchReceiver, searchState } = useSearchRemote();

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      toolbar: {},
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
          addForm: {
            value: 1,
          },
        },
        receiver: {
          title: '接收者',
          column: { show: false },
          form: {
            // component: {
            //   name: 'a-select',
            //   vModel: 'value',
            //   filterOption: false,
            //   showSearch: true,
            //   allowClear: true,
            //   placeholder: '请输入搜索内容',
            //   options: searchState.data,
            //   onSearch: compute(({ form }) => {
            //     if (!form.type) {
            //       return <a-spin size="small" />;
            //     }
            //     console.log('form', form.type);
            //     return function (value) {
            //       fetchReceiver(value);
            //     };
            //   }),
            //   children: {
            //     notFoundContent() {
            //       if (searchState.fetching.value) {
            //         return <a-spin size="small" />;
            //       }
            //       return '暂无记录';
            //     },
            //   },
            // },
          },
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
