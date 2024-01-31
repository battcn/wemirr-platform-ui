import * as api from "./api";
import { useMessage } from "@/hooks/web/useMessage";
import dayjs from "dayjs";

export default function () {
  const { notification } = useMessage();
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) => await api.GetList(query),
        addRequest: async ({ form }) => await api.AddObj(form),
        editRequest: async ({ form }) => await api.UpdateObj(form),
        delRequest: async ({ row }) => await api.DelObj(row.id),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {
          add: {
            show: false,
            icon: "codicon:repo-force-push",
            text: "文件上传",
            async click(context) {
              console.log(context);
              notification.error({
                message: "暂未实现",
                duration: 3,
              });
            },
          },
        },
      },
      rowHandle: {
        width: 90,
        buttons: {
          add: { show: false },
          view: { show: false },
          edit: { show: false },
          download: {
            icon: "ant-design:cloud-download-outlined",
            type: "link",
            text: null,
            size: "small",
            title: "文件下载",
            order: 1,
            async click() {
              notification.error({
                message: "暂未实现",
                duration: 3,
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
        originName: {
          title: "原始名",
          type: "text",
          column: { ellipsis: true, width: 230 },
          search: { show: true },
        },
        targetName: {
          title: "目标名",
          type: "text",
          column: { ellipsis: true, width: 230 },
        },
        ip: {
          title: "IP",
          type: "text",
          column: { ellipsis: true, width: 130 },
        },
        location: {
          title: "登录地点",
          type: "text",
          column: { ellipsis: true, width: 230 },
        },
        os: {
          title: "操作系统",
          type: "text",
          column: { ellipsis: true, width: 150 },
        },
        engine: {
          title: "引擎类型",
          type: "text",
          column: { ellipsis: true, width: 150 },
        },
        engineVersion: {
          title: "引擎版本",
          type: "text",
          column: { ellipsis: true, width: 150 },
        },
        createdName: {
          title: "上传者",
          type: "text",
          column: { ellipsis: true, width: 180 },
        },
        createdTime: {
          title: "上传时间",
          type: "datetime",
          form: { show: false },
          column: { ellipsis: true, width: 180 },
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
