import { dict } from "@fast-crud/fast-crud";
import { GET, DELETE, POST } from "@/api/service";
import dayjs from "dayjs";

export default function ({ expose }) {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await GET(`/authority/registered_client_refs`, query),
        addRequest: async ({ form }) => {
          form.tokenSettings = {
            accessTokenTimeToLive: form.accessTokenTimeToLive,
            refreshTokenTimeToLive: form.refreshTokenTimeToLive,
          };
          await POST(`/authority/registered_client_refs`, form);
        },
        editRequest: async ({ form }) => {
          form.tokenSettings = {
            accessTokenTimeToLive: form.accessTokenTimeToLive,
            refreshTokenTimeToLive: form.refreshTokenTimeToLive,
          };
          await POST(`/authority/registered_client_refs`, form);
        },
        delRequest: async ({ row }) =>
          await DELETE(`/authority/registered_client_refs/${row.clientId}`),
      },
      table: {
        rowKey: "clientId",
      },
      columns: {
        clientName: {
          title: "客户名称",
          type: "text",
          column: { ellipsis: true, width: 180 },
          search: { show: true },
          form: {
            rules: [{ required: true, message: "客户名称不能为空" }],
          },
        },
        clientId: {
          title: "客户标识",
          type: "text",
          search: { show: true },
          column: { ellipsis: true, width: 200 },
          editForm: { component: { disabled: true } },
          form: {
            rules: [{ required: true, message: "clientId 不能为空" }],
          },
        },
        clientSecret: {
          title: "客户秘钥",
          type: "text",
          column: { width: 200, show: false },
          editForm: { show: false },
          form: {
            rules: [{ required: true, message: "clientSecret 不能为空" }],
            helper: "注意：填写后将以密文方式存储且不允许修改",
          },
        },
        clientIdIssuedAt: {
          title: "生效时间",
          column: { width: 200 },
          type: "datetime",
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
          valueResolve({ value, row, key }) {
            if (value != null) {
              row[key] = value.unix();
            }
          },
          form: {
            helper: "不填则默认当前时间",
          },
        },
        clientSecretExpiresAt: {
          title: "过期时间",
          column: { width: 200 },
          type: "datetime",
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
          valueResolve({ value, row, key }) {
            if (value != null) {
              row[key] = value.unix();
            }
          },
          form: {
            helper: "不填则永不失效",
          },
        },
        scopes: {
          title: "授权范围",
          type: "dict-select",
          column: { width: 200, component: { color: "auto" } },
          dict: dict({
            data: [
              { value: "platform", label: "平台端", color: "warning" },
              { value: "server", label: "服务端", color: "success" },
              { value: "client", label: "客户端", color: "success" },
              { value: "mobile", label: "手机端", color: "success" },
              { value: "mini_app", label: "小程序", color: "success" },
              { value: "tripartite", label: "小程序", color: "success" },
            ],
          }),
          form: {
            rules: [{ required: true, message: "授权范围不能为空（后续可以内置成字典）" }],
            component: { mode: "multiple" },
          },
        },
        authorizationGrantTypes: {
          title: "授权类型",
          type: "dict-select",
          form: {
            rules: [{ required: true, message: "授权范围不能为空" }],
            component: { mode: "multiple" },
          },
          dict: dict({
            data: [
              { value: "password", label: "密码模式", color: "success" },
              {
                value: "urn:ietf:params:oauth:grant-type:custom",
                label: "自定义模式",
                color: "success",
              },
              { value: "authorization_code", label: "授权码模式", color: "success" },
              { value: "client_credentials", label: "客户端模式", color: "warning" },
              { value: "refresh_token", label: "RefreshToken", color: "warning" },
            ],
          }),
          column: { ellipsis: true, width: 470 },
        },
        accessTokenTimeToLive: {
          title: "AT 有效期",
          type: "text",
          column: { ellipsis: true, width: 180 },
          addForm: {
            value: "120",
          },
          form: {
            component: {
              addonAfter: "分钟",
            },
            rules: [{ required: true, message: "Token有效期不能为空" }],
            helper: "Token有效期,默认2小时",
          },
        },
        // 暂时没啥用不放出来了
        refreshTokenTimeToLive: {
          title: "RF 有效期",
          type: "text",
          column: { ellipsis: true, width: 180 },
          addForm: {
            value: "4320",
          },
          form: {
            component: {
              addonAfter: "分钟",
            },
            rules: [{ required: true, message: "Token有效期不能为空" }],
            helper: "Refresh Token有效期,默认3天(4320)",
          },
        },
        redirectUris: {
          title: "回调地址",
          type: ["textarea"],
          column: { ellipsis: true, show: false },
          form: {
            rules: [{ required: true, message: "请填写回调地址" }],
          },
        },
      },
    },
  };
}
