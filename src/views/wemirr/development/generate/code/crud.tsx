import { defHttp } from "@/utils/http/axios";
import dayjs from "dayjs";
import { dict } from "@fast-crud/fast-crud";
import { downloadByData } from "@/utils/file/download";

export default function ({ userStore }) {
  const pageRequest = async (query: any) =>
    await defHttp.get({ url: "/tools/generates", params: query });
  // eslint-disable-next-line prettier/prettier
  const editRequest = async ({ form }:any) => await defHttp.put({url:`/tools/generates/${form.id}`,data: form});
  const delRequest = async ({ row }: any) =>
    await defHttp.delete({ url: `/tools/generates/${row.id}` });
  const addRequest = async ({ form }: any) =>
    await defHttp.post({ url: "/tools/generates", data: form });
  return {
    crudOptions: {
      request: {
        pageRequest,
        editRequest,
        delRequest,
        addRequest,
      },
      table: {
        scroll: { fixed: true },
      },
      rowHandle: {
        width: 260,
        fixed: "right",
        buttons: {
          download: {
            // icon: "ant-design:cloud-download-outlined",
            type: "link",
            text: "代码生成",
            size: "small",
            title: "代码生成",
            async click(context) {
              await defHttp
                .request(
                  {
                    url: `/tools/generates/${context.row.id}/download`,
                    method: "POST",
                    responseType: "blob",
                  },
                  { isTransformResponse: false },
                )
                .then((res) => {
                  downloadByData(res, `${context.row.moduleName}.zip`);
                });
            },
          },
          remove: { order: 2 },
        },
      },
      columns: {
        id: {
          title: "ID",
          type: "text",
          form: { show: false },
          column: { show: false },
        },
        tableName: {
          title: "表名",
          type: "dict-select",
          dict: dict({
            url: "/tools/generates/tables",
          }),
          column: { width: 250, component: { color: "auto" } },
          form: {
            rules: [{ required: true, message: "表名不能为空" }],
            component: {
              showSearch: true,
              filterOption(inputValue, option) {
                return (
                  option.label.indexOf(inputValue) >= 0 || option.value.indexOf(inputValue) >= 0
                );
              },
            },
          },
        },
        tablePrefix: {
          title: "表前缀",
          type: "text",
          column: { width: 100 },
          form: {
            helper: "文件前缀擦除(t_ => t_user => User)",
          },
        },
        moduleName: {
          title: "模块名",
          type: "text",
          column: { width: 200 },
          form: {
            rules: [{ required: true, message: "模块名不能为空" }],
          },
        },
        parentPackage: {
          title: "父包",
          type: "text",
          column: { width: 250 },
          form: {
            rules: [{ required: true, message: "父包不能为空" }],
          },
        },
        apiUrlPrefix: {
          title: "API前缀",
          type: "text",
          column: { width: 180 },
          form: {
            rules: [{ required: true, message: "API前缀不能为空" }],
          },
        },
        springdoc: {
          title: "Swagger",
          type: "dict-radio",
          form: { value: true },
          dict: dict({
            data: [
              { value: true, label: "是", color: "success" },
              { value: false, label: "否", color: "error" },
            ],
          }),
          column: { width: 100 },
        },
        rootDir: {
          title: "根目录",
          type: "text",
          column: { width: 200, ellipsis: true },
        },
        author: {
          title: "作者",
          type: "text",
          search: { show: true },
          column: { width: 180 },
          addForm: {
            value: userStore.getUserInfo?.realName,
          },
          form: {
            rules: [{ required: true, message: "作者不能为空" }],
            helper: "默认当前登录人昵称",
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
      },
    },
  };
}
