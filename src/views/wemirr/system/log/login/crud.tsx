import dayjs from "dayjs";
import { dict } from "@fast-crud/fast-crud";
import { defHttp } from "@/utils/http/axios";

export default function () {
  const pageRequest = async (query: any) =>
    await defHttp.get({ url: "/authority/login_logs", params: query });
  return {
    crudOptions: {
      request: {
        pageRequest,
      },
      table: {
        scroll: { fixed: true },
      },
      actionbar: {
        show: true,
        buttons: {
          add: {
            show: false,
          },
        },
      },
      rowHandle: {
        width: 70,
        //固定右侧
        fixed: "right",
        buttons: {
          view: { size: "small" },
          edit: { size: "small", show: false },
          remove: { size: "small", show: false },
        },
      },
      columns: {
        id: {
          title: "ID",
          type: "text",
          viewForm: { show: false },
          column: { show: false },
        },
        principal: {
          title: "登录账号",
          type: "text",
          search: { show: true },
          column: { width: 180 },
        },
        name: {
          title: "名称",
          type: "text",
          search: { show: true },
          column: { width: 160 },
        },
        ip: {
          title: "IP",
          type: "text",
          column: { width: 160 },
        },
        location: {
          title: "登录地点",
          type: "text",
          column: { width: 180 },
        },
        clientId: {
          title: "应用标识",
          type: "text",
          column: { width: 200, component: { color: "auto" } },
        },
        platform: {
          title: "操作平台",
          type: "dict-select",
          dict: dict({
            data: [
              { value: "Mac", label: "Mac" },
              { value: "Windows", label: "Windows" },
              { value: "Android", label: "Android" },
              { value: "iPhone", label: "iPhone" },
              { value: "Linux", label: "Linux" },
              { value: "Java", label: "Java" },
            ],
          }),
          column: { width: 100, component: { color: "auto" } },
          search: { show: true },
        },
        os: {
          title: "操作系统",
          type: "text",
          column: { width: 100, ellipsis: true, component: { color: "auto" } },
        },
        engine: {
          title: "引擎类型",
          type: "text",
          column: { width: 100, component: { color: "auto" } },
        },
        browser: {
          title: "浏览器",
          type: "text",
          column: { width: 100, component: { color: "auto" } },
        },
        createdTime: {
          title: "创建时间",
          type: "datetime",
          column: { width: 160 },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
      form: {
        display: "flex",
        group: {
          type: "collapse", // tab
          accordion: false, //手风琴模式
          groups: {
            baseInfo: {
              header: "基础信息",
              columns: ["principal", "name", "ip", "location"],
            },
            reqInfo: {
              header: "请求信息",
              columns: ["clientId", "platform", "os", "engine", "browser"],
            },
            otherInfo: {
              header: "其它信息",
              collapsed: false, //默认折叠
              columns: ["createdTime"],
            },
          },
        },
      },
    },
  };
}
