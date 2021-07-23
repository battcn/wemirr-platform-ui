import * as api from './api';
import { compute, dict, utils } from '@fast-crud/fast-crud';
import moment from 'moment';
import { useMessage } from '/@/hooks/web/useMessage';

export default function ({ expose }) {
  console.log('router', expose);
  const pageRequest = async (query) => {
    return await api.GetList(query).then((ret) => {
      return ret.data;
    });
  };
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
    return await api.SaveOrUpdate(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.id);
  };

  const addRequest = async ({ form }) => {
    return await api.SaveOrUpdate(form);
  };

  const { notification } = useMessage();

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      table: {
        scroll: { fixed: true },
      },
      rowHandle: {
        fixed: 'right',
        width: 170,
        buttons: {
          edit: {
            show: compute(({ row }) => {
              console.log('row.dynamic', row.dynamic);
              return row.dynamic;
            }),
          },
          remove: {
            show: compute(({ row }) => {
              return row.dynamic;
            }),
          },
          up: {
            type: 'link',
            text: null,
            title: '上线',
            icon: 'bi:cloud-arrow-up',
            size: 'small',
            order: 4,
            show: compute(({ row }) => {
              return row.dynamic && !row.status;
            }),
            async click(context) {
              await api.ServiceStatus(context.record.id, true).then((ret) => {
                notification.success({ message: '路由发布成功', duration: 2 });
              });
              expose.doRefresh();
            },
          },
          down: {
            type: 'link',
            text: null,
            title: '下线',
            icon: 'bi:cloud-arrow-down',
            size: 'small',
            order: 5,
            show: compute(({ row }) => {
              return row.dynamic && row.status;
            }),
            async click(context) {
              await api.ServiceStatus(context.record.id, false).then((ret) => {
                notification.success({ message: '路由下线成功', duration: 2 });
              });
              expose.doRefresh();
            },
          },
        },
        // bi-cloud-arrow-up
      },
      search: { show: false },
      columns: {
        id: {
          title: '路由ID',
          type: 'text',
          column: { ellipsis: true, width: 280 },
          // dict: dict({
          //   url: '/gateway/discoveries/dict',
          //   label: 'serviceId',
          //   value: 'serviceId',
          // }),
          editForm: {
            component: {
              disabled: true,
            },
          },
          form: {
            rules: [{ required: true, message: '路由ID不能为空' }],
            helper: '路由ID一经录入无法修改',
          },
        },
        name: {
          title: '服务名',
          type: 'text',
          column: { ellipsis: true, width: 240 },
          form: {
            rules: [{ required: true, message: '路由名称不能为空' }],
            helper: '请填写正确的ServiceId,否则影响路由',
          },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          column: { width: 70, align: 'center' },
          search: { show: true },
          dict: dict({
            data: [
              { value: true, label: '上线', color: 'success' },
              { value: false, label: '下线', color: 'error' },
            ],
          }),
          form: {
            show: false,
            helper: '如果服务未注册成功,上线会失败',
          },
        },
        dynamic: {
          title: '路由类型',
          type: 'dict-radio',
          column: { width: 90, align: 'center' },
          dict: dict({
            data: [
              { value: true, label: '动态路由', color: 'warning' },
              { value: false, label: '初始路由', color: 'success' },
            ],
          }),
          form: { show: false },
        },
        order: {
          title: '拦截顺序',
          type: ['number'],
          column: { width: 90 },
          addForm: { value: 0 },
        },
        uri: {
          title: 'URI',
          column: { ellipsis: true, width: 280 },
          type: 'text',
          form: {
            rules: [{ required: true, message: '路由URI不能为空' }],
          },
        },
        description: {
          title: '描述',
          column: { ellipsis: true, width: 200 },
          type: ['textarea', 'colspan'],
        },
        predicates: {
          title: '条件过滤',
          type: ['text', 'colspan'],
          search: { show: true },
          column: { show: false },
        },
        filters: {
          title: '过滤器',
          type: ['text', 'colspan'],
          column: {
            show: false,
            component: { name: 'fs-values-format' },
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
