import { dict, useColumns } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';
import createCrudOptionsText from '#/views/wemirr/platform/db/crud';

const { buildFormOptions } = useColumns();

// 使用crudOptions结构来构建自定义表单配置
const tenantSettingOptions = {
  columns: {
    siteUrl: {
      title: '站点',
      type: ['textarea'],
      column: { ellipsis: true, show: false },
      form: {
        col: { span: 24 },
        rules: [
          { required: true, message: '请输入租户站点' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符' },
        ],
      },
    },
    siteTitle: {
      title: '标题',
      type: ['text'],
      column: { ellipsis: true, show: false },
    },
    siteSubTitle: {
      title: '子标题',
      type: ['textarea'],
      form: {
        col: {
          span: 24,
        },
      },
    },
    siteLogo: {
      title: 'LOGO',
      type: 'cropper-uploader',
      style: { height: 70 },
      column: { width: 70, align: 'center', show: false },
      valueBuilder({ value, row, key }: any) {
        if (value !== null && value.indexOf('http')) {
          row[key] = `http://www.docmirror.cn:7070${value}`;
        }
      },
      form: {
        col: {
          span: 24,
        },
      },
      // form: {
      //   component: {
      //     uploader: {
      //       type: 'form', // 上传后端类型【cos,aliyun,oss,form】
      //       buildUrl(res: any) {
      //         return `http://www.docmirror.cn:7070/${res.url}`;
      //       },
      //     },
      //   },
      // },
    },
    dbId: {
      title: 'DB配置',
      type: 'table-select',
      dict: dict({
        value: 'id',
        label: 'name',
        getNodesByValues: async (values: any[]) => {
          return defHttp
            .get('/iam/db-setting/active', { params: values });
        },
      }),
      form: {
        component: {
          crossPage: true,
          valuesFormat: {
            labelFormatter: (item: any) => {
              return `${item.id}.${item.name}`;
            },
          },
          select: { placeholder: '点击选择' },
          createCrudOptions: createCrudOptionsText,
          crudOptionsOverride: {
            toolbar: { show: false },
            actionbar: { buttons: { add: { show: false } } },
            rowHandle: { show: false },
          },
          on: {
            selectedChange({ form, $event }) {
              form.dbConfig = `${$event[0].host},${$event[0].username},${
                $event[0].password
              }`;
            },
          },
        },
        helper: '选择数据源后,租户数据将会写入到指定的库中',
      },
    },
    dbConfig: {
      title: 'DB信息',
      type: 'textarea',
      form: {
        col: { span: 24 },
        component: { disabled: true },
      },
    },
  },
  form: {
    group: {
      groupType: 'collapse',
      accordion: false,
      groups: {
        'site-info': {
          tab: '站点配置',
          header: '站点配置',
          columns: ['siteUrl', 'siteTitle', 'siteSubTitle', 'siteLogo'],
        },
        'db-config': {
          tab: 'DB配置',
          header: 'DB配置',
          columns: ['dbId', 'dbConfig'],
        },
      },
    },
    wrapper: { title: '租户设置' },
    doSubmit({ form }: any): void {
      return defHttp
        .put(`/iam/tenants/${form.tenantId}/setting`, form)
        .then((ret) => {
          return ret;
        });
    },
    afterSubmit(ctx: any) {
      if (!ctx.res.successful) {
        return false;
      }
    },
  },
};
export const tenantSettingFormOptions = buildFormOptions(tenantSettingOptions);
