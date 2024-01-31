import * as api from "./api";
import { useMessage } from "@/hooks/web/useMessage";
import { compute, dict } from "@fast-crud/fast-crud";
import dayjs from "dayjs";
import { usePermission } from "@/hooks/web/usePermission";
import { DictCode, dictFunc } from "@/api/dict/dict";

export default function ({ searchRemote }) {
  const { hasPermission } = usePermission();
  const { notification } = useMessage();
  const { fetchReceiver, searchState } = searchRemote;
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) => await api.GetList(query),
        addRequest: async ({ form }: any) => await api.AddObj(form),
        editRequest: async ({ form }: any) => await api.UpdateObj(form),
        delRequest: async ({ row }: any) => await api.DelObj(row.id),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {
          add: {
            icon: "codicon:repo-force-push",
            text: "发布消息",
          },
        },
      },
      rowHandle: {
        width: 250,
        buttons: {
          publish: {
            type: "link",
            text: "消息推送",
            size: "small",
            title: "消息推送",
            order: 4,
            show: hasPermission("sys:site_notify:publish"),
            async click({ row }) {
              await api.PublishMessage(row.id).then(() => {
                notification.success({
                  message: "消息通知成功",
                  duration: 3,
                });
              });
            },
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
        title: {
          title: "标题",
          type: "text",
          column: { show: true, width: 200 },
          search: { show: true },
          form: {
            rules: [{ required: true, message: "标题不能为空" }],
          },
        },
        level: {
          title: "级别",
          type: "dict-select",
          search: { show: true },
          column: { show: true, width: 180 },
          dict: dictFunc(DictCode.NOTICE),
          form: {
            rules: [{ required: true, message: "消息类型不能为空" }],
          },
        },
        type: {
          title: "接收类型",
          search: { show: true },
          column: { show: true, align: "center", width: 180 },
          type: "dict-radio",
          dict: dict({
            data: [
              { value: 1, label: "个人", color: "success" },
              { value: 2, label: "角色", color: "error" },
            ],
          }),
          form: {
            valueChange: ({ value, form, ...content }) => {
              console.log("value", value, "form", form, "content", content);
              fetchReceiver(value, "");
            },
          },
          addForm: {
            value: 1,
          },
        },
        receiver: {
          title: "接收者",
          column: { show: false, width: 180 },
          form: {
            rules: [{ required: true, message: "接收者不能为空" }],
            component: {
              name: "a-select",
              vModel: "value",
              filterOption: false,
              mode: "multiple",
              showSearch: true,
              allowClear: true,
              placeholder: "请输入搜索内容",
              options: searchState.data,
              onSearch: compute(({ form }) => {
                if (!form.type) {
                  return "暂无记录";
                }
                return function (value) {
                  fetchReceiver(form.type, value);
                };
              }),
              children: {
                notFoundContent() {
                  if (searchState.fetching.value) {
                    return <a-spin size="small" />;
                  }
                  return "暂无记录";
                },
              },
            },
          },
        },
        content: {
          title: "消息内容",
          type: ["editor-wang"],
          column: { ellipsis: true, width: 200 },
          viewForm: {
            disabled: true,
          },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: "消息内容不能为空" }],
            component: {
              uploader: {
                type: "form", // 上传后端类型【cos,aliyun,oss,form】
                buildUrl(res) {
                  return "http://www.docmirror.cn:7070" + res.url;
                },
              },
              on: {
                "text-change": (event) => {
                  console.log("text-change:", event);
                },
              },
            },
          },
        },
        description: {
          title: "描述信息",
          type: "textarea",
          column: { ellipsis: true, width: 200 },
          form: {
            col: { span: 24 },
          },
        },
        createdName: {
          title: "发布人",
          type: "text",
          column: { show: false, width: 180 },
          form: { show: false },
        },
        createdTime: {
          title: "通知时间",
          type: "datetime",
          column: { show: true, width: 180 },
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
