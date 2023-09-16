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
          type: ["text", "colspan"],
          search: { show: true },
          column: { ellipsis: true, width: 200 },
          form: {
            wrapperCol: { span: 9 },
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
        // connectionType: {
        //   title: '连接类型',
        //   type: ['dict-radio'],
        //   search: { show: true },
        //   column: { ellipsis: true, width: 120 },
        //   addForm: { value: 0 },
        //   dict: dict({
        //     data: [
        //       { value: 0, label: '多 schema', color: 'success' },
        //       { value: 1, label: '单 schema', color: 'success' },
        //     ],
        //   }),
        //   form: {
        //     helper: '多 schema 意味着一个数据源多个库',
        //     rules: [{ required: true, message: '请选择数据库类型' }],
        //   },
        // },
        // database: {
        //   title: '数据库名',
        //   type: 'text',
        //   column: { show: false },
        //   form: {
        //     show: compute(({ form }) => {
        //       return form.connectionType === 1;
        //     }),
        //     rules: [
        //       { required: true, message: '数据库名称不能为空' },
        //       { min: 8, max: 50, message: '长度在 8 到 100 个字符' },
        //     ],
        //   },
        // },
        host: {
          title: "Host",
          type: ["textarea"],
          column: { show: true, width: 120, ellipsis: true },
          form: {
            col: { span: 24 },
            helper: "Host格式 ip:port ",
            rules: [
              { required: true, message: "Host不能为空" },
              { min: 8, max: 100, message: "长度在 8 到 100 个字符" },
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
