import { compute, dict } from "@fast-crud/fast-crud";
import dayjs from "dayjs";
import { GET, POST, PUT, DELETE } from "@/api/service";
import { usePermission } from "@/hooks/web/usePermission";

export default function () {
  const { hasPermission } = usePermission();

  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await GET(`/authority/i18n`, query),
        addRequest: async ({ form }) => await POST(`/authority/i18n`, form),
        editRequest: async ({ form }) => await PUT(`/authority/i18n/${form.id}`, form),
        delRequest: async ({ row }) => await DELETE(`/authority/i18n/${row.id}`),
      },
      rowHandle: {
        width: 250,
        buttons: {
          edit: { size: "small", show: hasPermission("tenant:dict:edit") },
          remove: {
            show: compute(({ row }) => {
              return !row.readonly && hasPermission("tenant:dict:remove");
            }),
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
        code: {
          title: "编码",
          search: { show: true },
          type: "text",
          form: {
            rules: [{ required: true, message: "编码不能为空" }],
          },
        },
        languages: {
          title: "语言区",
          type: ["text"],
          column: {
            show: false,
            component: { name: "fs-values-format" },
          },
          form: {
            col: { span: 24 },
          },
        },
        remark: {
          title: "备注",
          type: ["textarea"],
          form: {
            col: { span: 24 },
          },
        },
        createdName: {
          title: "创建人",
          type: "text",
          addForm: { show: false },
          editForm: { show: false },
        },
        createdTime: {
          title: "创建时间",
          type: "datetime",
          addForm: { show: false },
          editForm: { show: false },
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
