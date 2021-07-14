import * as api from './api';
import { useCompute, dict } from '@fast-crud/fast-crud';
const { compute, asyncCompute } = useCompute();

export default function ({ expose, nodeRef }) {
  const pageRequest = async (query) => {
    return await api
      .GetResourceList({ parentId: nodeRef.value.id, type: '2', size: query.size })
      .then((ret) => {
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
      toolbar: {
        buttons: {
          search: {
            show: false,
          },
        },
      },
      actionbar: {
        buttons: {
          add: {
            show: false,
          },
        },
      },
      table: {
        size: 'small',
        scroll: {
          //需要设置它，否则滚动条拖动时，表头不会动
          fixed: true,
        },
      },
      rowHandle: {
        show: true,
        width: 130,
        dropdown: {
          // 操作列折叠
          atLeast: 1,
          more: { size: 'small', text: 'more...', icon: null },
        },
      },
      search: { show: false },
      buttons: {
        show: false,
      },
      columns: {
        id: {
          title: 'id',
          column: { show: false },
          form: { show: false },
        },
        parentId: {
          title: '父ID',
          column: { show: false },
          form: {
            value: null,
            component: {
              disabled: true,
              // value: asyncCompute({
              //   watch(content) {
              //     console.log('form', content);
              //     return content.compute;
              //   },
              //   async asyncFn(watchValue) {
              //     console.log('监听switch,触发远程获取options', watchValue);
              //   },
              // }),
              // value: compute((context) => {
              //   console.log('context', context);
              //   return 1000;
              // }),
              // value: asyncCompute({
              //   //监听form.grade的值
              //   watch((context)={
              //
              // }),
              // }),
            },
            rules: [{ required: true, message: '请选择菜单后操作' }],
          },
        },
        type: {
          title: '类型',
          type: 'dict-select',
          column: { show: false },
          dict: dict({
            data: [
              { value: 1, label: '菜单' },
              { value: 2, label: '按钮' },
            ],
          }),
          addForm: {
            value: 2,
            component: {
              disabled: true,
            },
          },
        },
        label: {
          title: '名称',
          column: { width: 120, ellipsis: true },
          form: {
            rules: [{ required: true, message: '请填写资源名称' }],
          },
        },
        permission: {
          title: '编码',
          form: {
            component: {
              placeholder: 'menu:view',
            },
            rules: [{ required: true, message: '请填写资源权限编码' }],
            helper: '资源权限编码,如（user:view user:edit）',
          },
          column: {
            width: 300,
            ellipsis: true,
          },
        },
        sequence: {
          title: '排序',
          column: { width: 50, align: 'center' },
          type: 'number',
          form: {
            value: 0,
            component: {
              min: 0,
              max: 100,
            },
          },
        },
        description: {
          title: '描述',
          column: { show: false },
          type: 'textarea',
          // type: 'editor-wang',
          // type: 'editor-quill',
          form: {
            col: { span: 24 }, // flex模式跨列配置
            labelCol: { span: 2 }, // antdv 跨列时，需要同时修改labelCol和wrapperCol
            wrapperCol: { span: 21 },
          },
        },
      },
    },
  };
}
