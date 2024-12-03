import * as api from "./api";
import {compute, dict, utils} from "@fast-crud/fast-crud";
import dayjs from "dayjs";
import { SysDictCode, sysDictFunc } from "#/api";
import {notification} from "ant-design-vue";
import type {FsUploaderFormOptions} from "@fast-crud/fast-extends";
import "./editor.css";

export default function ({ searchRemote }) {
  // const { hasPermission } = usePermission();
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
            icon: "icon-park-outline:email-push",
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
            // show: hasPermission("sys:site_notify:publish"),
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
          dict: sysDictFunc(SysDictCode.NOTICE),
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
        content_wang: {
          title: "内容",
          column: {
            width: 300,
            show: false
          },
          // type: "editor-wang5", // 富文本图片上传依赖file-uploader，请先配置好file-uploader
          type: ["editor-wang"],
          viewForm: {
            render({ value }) {
              return <div class={"editor-content-view"} v-html={value}></div>;
            }
          },
          form: {
            helper: "示例已升级到wangEditor5版本，原来的editor-wang目前仍然可以使用，后续fs升级可能会将其删除，请尽快升级到editor-wang5版本",
            col: { span: 24 },
            // 动态显隐字段
            // show: compute(({ form }) => {
            //   return form.change === "wang";
            // }),
            rules: [
              { required: true, message: "此项必填" },
              {
                validator: async (rule, value) => {
                  if (value.trim() === "<p><br></p>") {
                    throw new Error("内容不能为空");
                  }
                }
              }
            ],
            component: {
              disabled: compute(({ form }) => {
                return form.disabled;
              }),
              id: "1", // 当同一个页面有多个editor时，需要配置不同的id
              toolbarConfig: {},
              editorConfig: {},
              onOnChange(value: any) {
                utils.logger.info("value changed", value);
              },
              uploader: {
                type: "form",
                buildUrl(res: any) {
                  return res.url;
                }
              } as FsUploaderFormOptions
            }
          }
        },
/*        content: {
          title: "消息内容",
          type: ["editor-wang5"],
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
        },*/
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
