import { dict, ScopeContext } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';

import createCrudOptionsTenant from '../../tenant/crud';

export default function () {
  return {
    crudOptions: {
      table: {},
      request: {
        pageRequest: async (query) =>
          await defHttp.get(`/iam/product_subscriptions/page`, {
            params: query,
          }),
        addRequest: async ({ form }) =>
          await defHttp.post(`/iam/product_subscriptions`, form),
        editRequest: async ({ form }) =>
          await defHttp.put(`/iam/product_subscriptions/${form.id}`, form),
        delRequest: async ({ row }) =>
          await defHttp.delete(`/iam/product_subscriptions/${row.id}`),
      },
      toolbar: {},
      rowHandle: {
        buttons: {
          edit: { show: false },
        },
      },
      form: {
        watch({ form }) {
          form.totalAmount = form.users * form.months * form.licensePrice;
          form.statementAmount = form.totalAmount - form.discountAmount;
          form.statementPrice = form.statementAmount / form.months / form.users;
          // if (form.months && form.startTime) {
          //   form.endTime = dayjs(form.startTime).add(form.months, "month");
          // }
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        tenantId: {
          title: '租户',
          search: { show: true },
          column: { width: 200, component: { color: 'auto' } },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'name',
            getNodesByValues: async (values: any[]) => {
              return await defHttp
                .post('/iam/tenants/ids', values)
                .then((ret) => ret.data);
            },
          }),
          form: {
            rules: [{ required: true, message: '请选择订阅的租户' }],
            component: {
              crossPage: true,
              valuesFormat: {
                labelFormatter: (item) => {
                  return item.name;
                },
              },
              createCrudOptions: createCrudOptionsTenant,
              crudOptionsOverride: {
                container: {
                  is: 'fs-layout-default',
                },
                rowHandle: { show: false },
                toolbar: { show: false },
                actionbar: { show: false },
                columns: {
                  type: { column: { show: false } },
                  email: { column: { show: false } },
                  industry: { column: { show: false } },
                  createdTime: { column: { show: false } },
                },
              },
            },
          },
        },

        productId: {
          title: '产品',
          column: { width: 150, component: { color: 'auto' } },
          type: 'dict-select',
          search: { show: true },
          dict: dict({
            url: '/iam/product_definitions/list',
          }),
          form: {
            rules: [{ required: true, message: '请选择订阅的产品' }],
            component: {
              showSearch: true,
              filterOption(inputValue: any, option: any) {
                return (
                  option.label.includes(inputValue) ||
                  option.value.includes(inputValue)
                );
              },
            },
          },
        },
        users: {
          title: '用户数量',
          type: 'number',
          column: { width: 120 },
          form: {
            component: { min: 1, max: 10_000 },
            rules: [{ required: true, message: '用户数量不能为空' }],
          },
        },
        months: {
          title: '月数',
          type: 'number',
          column: { width: 100 },
          form: {
            component: { min: 1, max: 120 },
            rules: [{ required: true, message: '采购月数不能为空' }],
            valueChange({ value, form }: ScopeContext) {
              if (value && form.startTime) {
                form.endTime = dayjs(form.startTime).add(form.months, 'month');
              }
            },
          },
        },
        licensePrice: {
          title: '单用户价',
          type: 'number',
          column: { width: 150 },
          form: {
            component: { min: 1, max: 99_999 },
            helper: '单个用户许可价格',
          },
        },
        totalAmount: {
          title: '总额',
          type: 'number',
          search: { show: false },
          column: { width: 150 },
          form: {
            component: { disabled: true },
          },
        },
        discountAmount: {
          title: '优惠',
          type: 'number',
          column: { width: 150 },
          addForm: {
            value: 0,
          },
          form: {
            component: { min: 0, max: 9_999_999 },
            rules: [{ required: true, message: '优惠金额不能为空' }],
          },
        },
        statementAmount: {
          title: '结算金额',
          type: 'number',
          search: { show: false },
          column: { width: 150 },
          form: {
            component: { disabled: true },
            rules: [{ required: true, message: '结算金额不能为空' }],
            helper: '结算金额 = 总额 - 优惠金额',
          },
        },
        statementPrice: {
          title: '结算单价',
          type: 'number',
          column: { width: 150 },
          form: {
            component: { disabled: true },
            helper: '结算单价 = 结算金额 / 月份 / 用户数',
          },
        },
        startTime: {
          title: '开始时间',
          type: 'date',
          valueResolve({ value, row, key }) {
            if (value !== null) {
              row[key] = dayjs(value).unix();
            }
          },
          valueBuilder({ value, row, key }: any) {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
          form: {
            rules: [{ required: true, message: '订阅起始日期不能为空' }],
            component: {
              format: 'YYYY-MM-DD',
            },
            valueChange({ value, form }: ScopeContext) {
              if (value && form.months) {
                form.endTime = dayjs(form.startTime).add(form.months, 'month');
              }
            },
          },
        },
        endTime: {
          title: '结束时间',
          type: 'date',
          valueResolve({ value, row, key }) {
            if (value != null) {
              row[key] = dayjs(value).unix();
            }
          },
          valueBuilder({ value, row, key }: any) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
          form: {
            component: {
              format: 'YYYY-MM-DD',
              disabled: true,
            },
            rules: [{ required: true, message: '订阅结束日期不能为空' }],
            helper: '结束日期 = 开始日期 + 采购月份',
          },
        },
        paymentStatus: {
          title: '状态',
          type: 'dict-select',
          column: { width: 100, align: 'center' },
          search: { show: true },
          dict: dict({
            data: [
              { value: '0', label: '待支付', color: 'error' },
              { value: '10', label: '部分支付', color: 'warning' },
              { value: '20', label: '已支付', color: 'success' },
            ],
          }),
          form: {
            rules: [{ required: true, message: '支付状态不能为空' }],
          },
        },
        description: {
          title: '产品描述',
          column: { show: false },
          type: ['textarea'],
          form: {
            rules: [{ required: true, message: '描述不能为空' }],
            col: {
              span: 24,
            },
          },
        },
        createdName: {
          title: '创建人',
          type: 'text',
          addForm: { show: false },
          editForm: { show: false },
          column: { width: 150, ellipsis: true },
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 170, sorter: true, align: 'center' },
          addForm: { show: false },
          editForm: { show: false },
          valueBuilder({ value, row, key }: any) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
    },
  };
}
