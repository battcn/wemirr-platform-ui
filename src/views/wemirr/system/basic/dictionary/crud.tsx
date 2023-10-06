import { shallowRef } from "vue";
import DictItemTable from "./item/index.vue";

import { compute, dict } from "@fast-crud/fast-crud";
import dayjs from "dayjs";

import { GET, POST, PUT, DELETE } from "@/api/service";
import { defHttp } from "@/utils/http/axios";
import { usePermission } from "@/hooks/web/usePermission";

export default function () {
  const { hasPermission } = usePermission();

  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await GET(`/authority/dictionaries`, query),
        addRequest: async ({ form }) => await POST(`/authority/dictionaries`, form),
        editRequest: async ({ form }) => await PUT(`/authority/dictionaries/${form.id}`, form),
        delRequest: async ({ row }) => await DELETE(`/authority/dictionaries/${row.id}`),
      },
      rowHandle: {
        width: 250,
        buttons: {
          remove: {
            show: compute(({ row }) => {
              return !row.readonly && hasPermission("sys:dict:remove");
            }),
          },
          refresh: {
            text: "刷新缓存",
            size: "small",
            type: "link",
            order: 2,
            show: hasPermission("sys:dict:refresh"),
            click: async function ({ row }) {
              await defHttp.get({ url: `/authority/dictionaries/${row.code}/refresh` });
            },
          },
        },
      },
      columns: {
        name: {
          title: "名称",
          search: { show: true },
          type: "text",
        },
        code: {
          title: "编码",
          search: { show: true },
          type: "text",
        },
        status: {
          title: "状态",
          type: "dict-radio",
          search: { show: true },
          column: { show: true, width: 100, align: "center" },
          dict: dict({
            data: [
              { value: 1, label: "启用", color: "success" },
              { value: 0, label: "禁用", color: "error" },
            ],
          }),
          addForm: { value: 1 },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = value === true ? 1 : 0;
            }
          },
        },
        readonly: {
          title: "内置",
          type: "dict-radio",
          column: { width: 100, align: "center" },
          addForm: { show: false },
          editForm: {
            component: {
              disabled: true,
            },
          },
          dict: dict({
            data: [
              { value: true, label: "是", color: "success" },
              { value: false, label: "否", color: "error" },
            ],
          }),
        },
        sequence: {
          title: "排序",
          column: { width: 100, align: "center" },
          type: "number",
          addForm: { value: 0 },
          form: { component: { min: 0, max: 100 } },
        },
        description: {
          title: "描述",
          type: ["textarea"],
          form: {
            col: { span: 24 },
          },
        },
        createdTime: {
          title: "创建时间",
          type: "datetime",
          form: { show: false },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
        },
        id: {
          title: "字典信息",
          column: { show: false },
          type: ["textarea"],
          form: {
            show: false,
            col: { span: 24 },
          },
          viewForm: {
            show: true,
            // 嵌套表格字段
            component: {
              //局部引用子表格，要用shallowRef包裹
              name: shallowRef(DictItemTable),
              vModel: "modelValue",
            },
          },
        },
      },
    },
  };
}
