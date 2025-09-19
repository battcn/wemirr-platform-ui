import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  UserPageQuery,
} from '@fast-crud/fast-crud';

import { dict, utils } from '@fast-crud/fast-crud';

import { SysDictCode, sysDictFunc } from '#/api';

import * as api from './api';

export default function crud({
  crudExpose,
  context,
}: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    context.selectedRows = selectedRows;
  };
  return {
    crudOptions: {
      table: {
        rowKey: 'id',
        rowSelection: {
          onChange: onSelectChange,
        },
      },
      request: {
        pageRequest: async (query: UserPageQuery) => await api.GetList(query),
        addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        editRequest: async ({ form }: EditReq) => await api.UpdateObj(form),
        delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {},
      },
      rowHandle: {
        width: 230,
        buttons: {},
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        code: {
          title: '编号',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160, fixed: 'left' },
          form: {
            rules: [
              { required: true, message: '请输入仓库编号' },
              { min: 0, max: 64, message: '长度在 0 到 64 个字符' },
            ],
          },
        },
        name: {
          title: '名称',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160, fixed: 'left' },
          form: {
            rules: [
              { required: true, message: '请输入仓库名称' },
              { min: 0, max: 255, message: '长度在 0 到 255 个字符' },
            ],
          },
        },
        timezone: {
          title: '时区',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [
              { required: true, message: '请输入时区' },
              { min: 0, max: 32, message: '长度在 0 到 32 个字符' },
            ],
          },
        },
        attribute: {
          title: '属性',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入属性' }],
          },
        },
        unit: {
          title: '单位',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 100 },
          form: {
            rules: [{ required: false, message: '请输入计量单位' }],
          },
        },
        postcode: {
          title: '邮编',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 100 },
          form: {
            rules: [{ required: false, message: '请输入邮编' }],
          },
        },
        // 目的是为了用户体验更好,打开弹窗和进入页面更快速
        areaText: {
          title: '地区',
          column: { width: 200, show: true },
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
          search: { show: false },
          type: 'dict-cascader',
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (!utils.strings.hasEmpty(row.provinceId)) {
              row[key] = [row.provinceId, row.cityId, row.districtId];
            }
          },
          dict: dict({
            cache: true,
            isTree: true,
            url: '/iam/areas/trees',
            value: 'id',
            label: 'name',
          }),
          form: {
            rules: [{ required: true, message: '仓库地址不能为空' }],
            component: {
              changeOnSelect: true,
              placeholder: '请选择地址',
              vModel: 'value',
              on: {
                selectedChange({ $event, key, form }) {
                  if (
                    form[key] !== null &&
                    !utils.strings.hasEmpty(form[key])
                  ) {
                    form.provinceId = $event[0]?.value;
                    form.provinceName = $event[0]?.label;
                    form.cityId = $event[1]?.value;
                    form.cityName = $event[1]?.label;
                    form.districtId = $event[2]?.value;
                    form.districtName = $event[2]?.label;
                  } else {
                    form.provinceId = null;
                    form.provinceName = null;
                    form.cityId = null;
                    form.cityName = null;
                    form.districtId = null;
                    form.districtName = null;
                  }
                },
              },
              showSearch: {
                filter: (inputValue, path) => {
                  return path.some((option) =>
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
          title: '详细地址',
          type: ['textarea'],
          column: { ellipsis: true, show: false },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: '详细地址不能为空' }],
          },
        },
        contactPerson: {
          title: '联系人',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入联系人' }],
          },
        },
        contactEmail: {
          title: '邮箱',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: false, message: '请输入邮箱' }],
          },
        },
        contactPhone: {
          title: '联系电话',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入联系电话' }],
          },
        },
        status: {
          title: '状态',
          search: { show: true },
          column: { width: 100, component: { color: 'auto' } },
          type: 'dict-select',
          dict: sysDictFunc(SysDictCode.STATUS),
          form: {
            rules: [{ required: true, message: '请选择仓库状态' }],
          },
        },
        remark: {
          title: '备注',
          type: 'textarea',
          column: { show: false },
          form: { col: { span: 24 } },
        },
        createName: {
          title: '创建人',
          type: 'text',
          form: { show: false },
          column: { ellipsis: true, width: 160 },
        },
        createTime: {
          title: '创建时间',
          type: ['datetime', 'wp-readonly-time'],
        },
      },
    },
  };
}
