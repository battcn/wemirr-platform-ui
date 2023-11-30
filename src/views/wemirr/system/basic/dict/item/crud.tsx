import dayjs from "dayjs";
import { dict } from "@fast-crud/fast-crud";
import { GET, POST, PUT, DELETE } from "@/api/service";
import { usePermission } from "@/hooks/web/usePermission";

export default function ({ expose, props, ctx }) {
  const { hasPermission } = usePermission();
  const dictionaryId = props.modelValue;
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => {
          return await GET(`/authority/tenant_dictionaries/${dictionaryId ?? 0}/items`, query);
        },
        addRequest: async ({ form }) =>
          await POST(`/authority/tenant_dictionaries/${dictionaryId}/items`, form),
        editRequest: async ({ form }) =>
          await PUT(`/authority/tenant_dictionaries/${dictionaryId}/items/${form.id}`, form),
        delRequest: async ({ row }) =>
          await DELETE(`/authority/tenant_dictionaries/${dictionaryId}/items/${row.id}`),
      },
      search: { show: false },
      rowHandle: {
        width: 150,
        align: "center",
        buttons: {
          view: { size: "small", show: false },
          edit: { size: "small", show: hasPermission("tenant:dict:edit") },
          remove: {
            show: hasPermission("tenant:dict:remove"),
          },
        },
      },
      columns: {
        id: {
          title: "ID",
          type: "text",
          form: { show: false },
          column: { show: false },
        },
        dictionaryId: {
          title: "字典ID",
          type: "text",
          form: { show: false },
          column: { show: false },
        },
        label: {
          title: "名称",
          search: { show: true },
          type: "text",
          column: { width: 180 },
          form: {
            rules: [{ required: true, message: "编码不能为空" }],
          },
        },
        value: {
          title: "值",
          search: { show: false },
          type: "text",
          column: { width: 180 },
          form: {
            rules: [{ required: true, message: "编码不能为空" }],
          },
        },
        status: {
          title: "状态",
          type: "dict-radio",
          column: { width: 90 },
          search: { show: true },
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
        sequence: {
          title: "排序",
          column: { width: 50, align: "center" },
          type: "number",
          addForm: { value: 0 },
          form: { component: { min: 0, max: 100 } },
        },
        description: {
          title: "描述",
          column: { show: false },
          type: ["textarea"],
          form: {
            col: {
              span: 24,
            },
          },
        },
        createdTime: {
          title: "创建时间",
          type: "datetime",
          column: { width: 180, sorter: true },
          form: { show: false },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
    },
  };
}
