import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';

import { ref } from 'vue';

import { useAccess } from '@vben/access';

import { asyncCompute, compute, dict, utils } from '@fast-crud/fast-crud';
import { Modal, notification } from 'ant-design-vue';
import dayjs from 'dayjs';

import { getAreaTree, SysDictCode, sysDictFunc } from '#/api';
import { defHttp } from '#/api/request';

import * as api from './api';
import { tenantSettingFormOptions } from './scheam';

const tenantRow = ref();

export default function (props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { crudExpose } = props;
  const { hasPermission } = useAccess();
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery) => {
          if (query.area) {
            query.provinceId = query?.area[0];
            query.cityId = query?.area[1];
            query.districtId = query?.area[2];
          }
          return await defHttp.post(`/iam/tenants/page`, query);
        },
        addRequest: async ({ form }: AddReq) =>
          await defHttp.post(`/iam/tenants/create`, form),
        editRequest: async ({ form }: EditReq) =>
          await defHttp.put(`/iam/tenants/${form.id}/modify`, form),
        delRequest: async ({ row }: DelReq) =>
          await defHttp.delete(`/iam/tenants/${row.id}`),
      },
      actionbar: {
        buttons: {},
      },
      rowHandle: {
        width: 180,
        fixed: 'right',
        dropdown: {
          // 操作列折叠
          atLeast: 1,
          more: {
            size: 'small',
            icon: null,
            text: '更多',
          },
        },
        buttons: {
          remove: { order: 5 },
          setting: {
            type: 'link',
            title: '租户设置',
            text: '租户设置',
            size: 'small',
            order: 3,
            // show: hasPermission('tenant:db-config'),
            async click({ row }) {
              if (!row.status) {
                notification.error({
                  message: '租户已被禁用,无法进行租户配置',
                  duration: 2,
                });
                return;
              }
              await api.getTenantSetting(row.id).then((ret) => {
                tenantSettingFormOptions.initialForm = {
                  ...ret.data,
                  tenantId: row.id,
                };
                // select.on.selectedChange
                // tenantSettingFormOptions.columns?.dbId?.component?.on?.selectedChange;
                // console.log('tenantSettingFormOptions', tenantSettingFormOptions);
                crudExpose.getFormWrapperRef().open(tenantSettingFormOptions);
              });
            },
          },
          init: {
            type: 'link',
            title: '数据初始',
            text: '数据初始',
            size: 'small',
            order: 4,
            show: hasPermission('tenant:init-script'),
            click({ row }) {
              Modal.confirm({
                iconType: 'warning',
                title: '风险提示',
                content: `确定初始化 [${row.name}] 数据吗?`,
                onOk: () => {
                  defHttp
                    .put(`/iam/tenants/${row.id}/init_sql_script`)
                    .then(() => {
                      notification.success({
                        message: '租户数据初始化成功',
                        duration: 2,
                      });
                    });
                },
              });
            },
          },
          refreshDict: {
            type: 'link',
            title: '字典刷新',
            text: '字典刷新',
            size: 'small',
            order: 4,
            show: hasPermission('tenant:refresh-dict'),
            click({ row }) {
              Modal.confirm({
                iconType: 'warning',
                title: '风险提示',
                content: `确定重新刷新租户的数据字典吗?`,
                onOk: () => {
                  defHttp
                    .put(`/iam/tenants/${row.id}/refresh-dict`)
                    .then(() => {
                      notification.success({
                        message: '租户字典刷新成功',
                        duration: 2,
                      });
                    });
                },
              });
            },
          },
        },
      },
      table: { scroll: { fixed: true } },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        code: {
          title: '编码',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 90 },
          form: {
            rules: [
              { required: true, message: '请输入编码' },
              { min: 4, max: 6, message: '长度在 4 到 6 个字符' },
            ],
          },
        },
        name: {
          title: '名称',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 200 },
          form: {
            rules: [
              { required: true, message: '请输入名称' },
              { min: 2, max: 30, message: '长度在 2 到 30 个字符' },
            ],
          },
        },
        alias: {
          title: '简称',
          type: 'text',
          column: { width: 100 },
          form: {
            rules: [
              { required: true, message: '请输入简称' },
              { min: 2, max: 8, message: '长度在 2 到 8 个字符' },
            ],
          },
        },
        contactPerson: {
          title: '联系人',
          type: 'text',
          column: { show: true, width: 120 },
          form: {
            rules: [{ min: 2, max: 30, message: '长度在 2 到 30 个字符' }],
          },
        },
        contactPhone: {
          title: '联系方式',
          type: 'text',
          column: { show: true, width: 150 },
          form: {
            rules: [{ min: 2, max: 30, message: '长度在 2 到 30 个字符' }],
          },
        },
        type: {
          title: '类型',
          search: { show: true },
          column: { show: true, align: 'center', width: 80 }, // 表单配置
          type: 'dict-radio',
          addForm: { value: 0 },
          dict: dict({
            data: [
              { value: 0, label: '其它', color: 'warning' },
              { value: 1, label: '企业', color: 'success' },
            ],
          }),
        },
        status: {
          title: '状态',
          addForm: { value: false },
          column: { show: true, align: 'center', width: 80 },
          type: 'dict-radio',
          dict: dict({
            data: [
              { value: true, label: '启用', color: 'success' },
              { value: false, label: '禁用', color: 'error' },
            ],
          }),
          form: {
            rules: [{ required: true, message: '状态不能为空' }],
          },
        },
        creditCode: {
          title: '信用代码',
          type: 'text',
          column: { ellipsis: true, show: false, width: 200 },
          form: {
            show: compute(({ form }) => {
              return form?.type === 1;
            }),
          },
        },
        legalPersonName: {
          title: '法人',
          type: 'text',
          column: { ellipsis: true, show: false },
          form: {
            show: compute(({ form }) => {
              return form?.type === 1;
            }),
          },
        },
        email: {
          title: '邮箱',
          type: 'text',
          column: { show: false, width: 200 },
          form: {
            rules: [{ min: 2, max: 30, message: '长度在 2 到 30 个字符' }],
          },
        },
        industry: {
          title: '行业',
          column: { show: true, width: 150 },
          type: 'dict-select',
          dict: sysDictFunc(SysDictCode.INDUSTRY),
        },
        // 目的是为了用户体验更好,打开弹窗和进入页面更快速
        areaText: {
          title: '地区',
          column: { width: 200 },
          form: { show: false },
          type: 'text',
          valueBuilder({ row }) {
            if (!utils.strings.hasEmpty(row.provinceName)) {
              row.areaText = row.provinceName;
            }
            if (!utils.strings.hasEmpty(row.cityName)) {
              row.areaText = `${row.provinceName} / ${row.cityName}`;
            }
            if (!utils.strings.hasEmpty(row.districtName)) {
              row.areaText = `${row.provinceName} / ${row.cityName} / ${
                row.districtName
              }`;
            }
          },
        },
        area: {
          title: '地区',
          column: { width: 200, show: false },
          search: { show: true },
          type: 'dict-cascader',
          valueBuilder({ value, row, key }: any) {
            if (!utils.strings.hasEmpty(row.provinceId)) {
              row[key] = [row.provinceId, row.cityId, row.districtId];
            }
          },
          valueResolve({ form, key }) {
            const row = form;
            if (row[key] !== null && !utils.strings.hasEmpty(row[key])) {
              row.provinceId = row[key][0];
              row.cityId = row[key][1];
              row.districtId = row[key][2];
            } else {
              row.provinceId = null;
              row.cityId = null;
              row.districtId = null;
            }
          },
          form: {
            component: {
              changeOnSelect: true,
              placeholder: '请选择地址',
              vModel: 'value',
              // 这种异步方式比用 dict 打开页面要快，体验要好点 但是存在的问题就是 column 没值
              options: asyncCompute({
                asyncFn: async () => {
                  return await getAreaTree();
                },
              }),
              showSearch: {
                filter: (inputValue: any, path: any) => {
                  return path.some((option: any) =>
                    option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase()),
                  );
                },
              },
            },
          },
        },
        address: {
          title: '地址',
          type: ['textarea'],
          column: { ellipsis: true, show: false },
          form: {
            col: { span: 24 },
          },
        },
        description: {
          title: '描述',
          type: ['textarea'],
          column: { ellipsis: true, show: false },
          form: {
            col: { span: 24 },
          },
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 180 },
          form: { show: false },
          valueBuilder({ value, row, key }: any) {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
      form: {
        group: {
          groupType: 'collapse',
          accordion: false,
          groups: {
            baseInfo: {
              tab: '基本信息',
              header: '基本信息',
              columns: [
                'code',
                'industry',
                'name',
                'alias',
                'type',
                'status',
                'locked',
                'creditCode',
                'legalPersonName',
                'area',
                'address',
                'description',
              ],
            },
            linkInfo: {
              tab: '联系方式',
              header: '联系方式',
              columns: ['contactPerson', 'contactPhone', 'email'],
            },
          },
        },
      },
    },
  };
}
