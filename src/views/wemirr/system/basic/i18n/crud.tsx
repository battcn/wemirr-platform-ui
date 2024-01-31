import dayjs from "dayjs";
import { defHttp } from "@/utils/http/axios";

export default function () {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) =>
          await defHttp.get({ url: `/authority/i18n`, params: query }),
        addRequest: async ({ form }: any) =>
          await defHttp.post({ url: `/authority/i18n`, data: form }),
        editRequest: async ({ form }: any) =>
          await defHttp.put({ url: `/authority/i18n/${form.id}`, data: form }),
        delRequest: async ({ row }: any) =>
          await defHttp.delete({ url: `/authority/i18n/${row.id}` }),
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
          column: { show: true, width: 180 },
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
          column: { show: true, width: 180 },
          addForm: { show: false },
          editForm: { show: false },
        },
        createdTime: {
          title: "创建时间",
          type: "datetime",
          column: { show: true, width: 180 },
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
