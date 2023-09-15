import { compute, dict, utils } from "@fast-crud/fast-crud";
import { GET, DELETE, POST, PUT } from "@/api/service";
import { useMessage } from "/@/hooks/web/useMessage";

export default function ({ expose }) {
  const { notification, createConfirm } = useMessage();
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await GET(`/authority/applications`, query),
        addRequest: async ({ form }) => await POST(`/authority/applications`, form),
        editRequest: async ({ form }) =>
          await PUT(`/authority/applications/${form.clientId}`, form),
        delRequest: async ({ row }) => await DELETE(`/authority/applications/${row.clientId}`),
      },
      rowHandle: { fixed: "right" },
      table: {
        rowKey: "clientId",
      },
      columns: {
        clientId: {
          title: "客户标识",
          type: "text",
          search: { show: true },
          column: { ellipsis: true, width: 100 },
          editForm: { component: { disabled: true } },
          form: {
            rules: [{ required: true, message: "客户标识不能为空" }],
          },
        },
        clientSecret: {
          title: "客户秘钥",
          type: "text",
          column: { width: 100, show: false },
          form: {
            rules: [{ required: true, message: "客户秘钥不能为空" }],
          },
        },
        clientName: {
          title: "客户名称",
          type: "text",
          column: { ellipsis: true, width: 150 },
          search: { show: true },
          form: {
            rules: [{ required: true, message: "客户名称不能为空" }],
          },
        },
        accessTokenValidity: {
          title: "登录时效",
          type: "text",
          column: { ellipsis: true, width: 80 },
          addForm: {
            value: "43200",
          },
          form: {
            component: {
              addonAfter: "秒",
            },
            rules: [{ required: true, message: "Token有效期不能为空" }],
            helper: "Token有效期,默认12小时(1小时 = 3600秒 = 60 * 60)",
          },
        },
        status: {
          title: "应用状态",
          type: "dict-switch",
          addForm: { value: true },
          column: {
            width: 80,
            align: "center",
            component: {
              name: "fs-dict-switch",
              vModel: "checked",
            },
            valueChange: ({ value, row, record }) => {
              createConfirm({
                iconType: "warning",
                title: "提示",
                content: `确定${row.status ? "启用" : "禁用"}吗`,
                onOk: () => {
                  PUT(`/authority/applications/${row.clientId}/${row.status}`).then(() => {
                    notification.success({
                      message: row.status ? "启用成功" : "禁用成功",
                      duration: 2,
                    });
                  });
                },
                onCancel: () => {
                  record.status = value;
                },
              });
            },
          },
          dict: dict({
            data: [
              { value: true, label: "启用", color: "success" },
              { value: false, label: "禁用", color: "warning" },
            ],
          }),
          form: {
            rules: [{ required: true, message: "应用状态不能为空" }],
          },
        },
        scope: {
          title: "授权范围",
          type: "dict-radio",
          addForm: { value: "all" },
          column: { width: 100 },
          dict: dict({
            data: [
              { value: "all", label: "全部", color: "warning" },
              { value: "server", label: "服务端", color: "success" },
              { value: "client", label: "客户端", color: "success" },
            ],
          }),
          form: {
            rules: [{ required: true, message: "授权范围不能为空" }],
          },
        },
        type: {
          title: "应用类型",
          type: "dict-select",
          addForm: { value: 0 },
          column: { width: 100 },
          dict: dict({
            data: [
              { value: 0, label: "综合应用", color: "warning" },
              { value: 1, label: "服务应用", color: "success" },
              { value: 2, label: "PC网页", color: "success" },
              { value: 3, label: "手机应用", color: "success" },
              { value: 4, label: "小程序应用", color: "success" },
            ],
          }),
          form: {
            rules: [{ required: true, message: "应用类型不能为空" }],
          },
        },
        authorizedGrantTypes: {
          title: "授权类型",
          type: ["dict-select"],
          form: {
            rules: [{ required: true, message: "授权范围不能为空" }],
            col: { span: 24 },
            labelCol: { span: 2 },
            wrapperCol: { span: 9 },
            component: { mode: "multiple" },
          },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = value.split(",");
            }
          },
          valueResolve({ form, key }) {
            form[key] = form[key]?.toString();
          },
          dict: dict({
            data: [
              { value: "password", label: "密码模式", color: "success" },
              { value: "authorization_code", label: "授权码模式", color: "success" },
              { value: "client_credentials", label: "客户端模式", color: "warning" },
              { value: "refresh_token", label: "RefreshToken", color: "warning" },
            ],
          }),
          column: { ellipsis: true, width: 350 },
        },
        additionalInformation: {
          title: "附加说明",
          type: ["textarea", "colspan"],
          column: { ellipsis: true },
        },
        webServerRedirectUri: {
          title: "回调地址",
          type: ["textarea", "colspan"],
          column: { ellipsis: true, show: false },
        },
        // 暂时没啥用不放出来了
        refreshTokenValidity: {
          title: "RefreshToken有效期",
          type: "text",
          column: { ellipsis: true, width: 180, show: false },
          form: {
            show: false,
            component: {
              addonAfter: "毫秒",
            },
          },
        },
        resourceIds: {
          title: "资源ID（微服务名）",
          type: "text",
          column: { show: false },
          form: { show: false },
        },
        authorities: {
          title: "authorities",
          type: "text",
          column: { show: false },
          form: { show: false },
        },
        autoApprove: {
          title: "自动批准",
          type: "text",
          column: { show: false },
          form: { show: false },
        },
      },
    },
  };
}
