import { dict } from "@fast-crud/fast-crud";
import dayjs from "dayjs";
import { GET, DELETE, POST, PUT } from "@/api/service";

export default function ({ expose }) {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await GET(`/authority/databases`, query),
        addRequest: async ({ form }) => await POST(`/authority/databases`, form),
        editRequest: async ({ form }) => await PUT(`/authority/databases/${form.id}`, form),
        delRequest: async ({ row }) => await DELETE(`/authority/databases/${row.id}`),
      },
      rowHandle: { fixed: "right" },
      columns: {
        id: {
          title: "ID",
          type: "text",
          form: { show: false },
          column: { show: false },
        },
        poolName: {
          title: "连接池",
          type: ["text"],
          search: { show: true },
          column: { ellipsis: true, width: 180 },
          form: {
            wrapperCol: { span: 9 },
            col: { span: 24 },
            helper: "数据源连接池名称(如: TenantDataSourcePool)",
            rules: [{ min: 2, max: 50, message: "长度在 2 到 8 个字符" }],
          },
        },
        username: {
          title: "用户名",
          type: "text",
          column: { width: 155 },
          form: {
            rules: [
              { required: true, message: "请输入账号名" },
              { min: 4, max: 30, message: "长度在 4 到 30 个字符" },
            ],
          },
        },
        password: {
          title: "密码",
          type: "password",
          column: { show: false, width: 120, ellipsis: true },
          form: {
            rules: [
              { required: true, message: "请输入密码" },
              { min: 6, max: 30, message: "长度在 6 到 30 个字符" },
            ],
          },
        },
        dbType: {
          title: "DB类型",
          type: "dict-select",
          search: { show: true },
          column: { ellipsis: true, width: 120 },
          addForm: { value: "mysql" },
          dict: dict({
            data: [{ value: "mysql", label: "MySQL", color: "success" }],
          }),
          form: {
            helper: "暂时只支持MySQL数据库哦",
            rules: [{ required: true, message: "请选择数据库类型" }],
          },
        },
        driverClassName: {
          title: "连接驱动",
          type: ["dict-select"],
          column: { ellipsis: true, width: 200 },
          addForm: { value: "com.mysql.cj.jdbc.Driver" },
          dict: dict({
            data: [
              {
                value: "com.mysql.cj.jdbc.Driver",
                label: "com.mysql.cj.jdbc.Driver",
                color: "success",
              },
            ],
          }),
          form: {
            helper: "暂时只支持MySQL数据库哦",
            rules: [{ required: true, message: "请选择数据库类型" }],
          },
        },
        url: {
          title: "URL",
          type: ["textarea"],
          column: { show: true, width: 300, ellipsis: true },
          form: {
            col: { span: 24 },
            helper: "如 jdbc:mysql://localhost:3309/wemirr-platform ",
            rules: [
              { required: true, message: "Host不能为空" },
              { min: 8, max: 1000, message: "长度在 8 到 1000 个字符" },
            ],
          },
        },
        locked: {
          title: "状态",
          search: { show: true },
          addForm: { value: false },
          column: { show: true, align: "center", width: 80 }, // 表单配置
          type: ["dict-radio"],
          dict: dict({
            data: [
              { value: false, label: "启用", color: "success" },
              { value: true, label: "禁用", color: "error" },
            ],
          }),
        },
        description: {
          title: "描述信息",
          type: ["textarea"],
          column: { ellipsis: true, show: false },
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
      },
    },
  };
}
