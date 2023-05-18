import { GET } from "/src/api/service";
import dayjs from "dayjs";

export default function ({ expose }) {
  const pageRequest = async (query) => await GET("/authority/login_logs", query);
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
          column: { width: 100 },
        },
        platform: {
          title: "操作平台",
          type: "text",
          column: { width: 100 },
        },
        os: {
          title: "操作系统",
          type: "text",
          column: { width: 100, ellipsis: true },
        },
        engine: {
          title: "引擎类型",
          type: "text",
          column: { width: 100 },
        },
        engineVersion: {
          title: "引擎版本",
          type: "text",
          column: { width: 100 },
        },
        browser: {
          title: "浏览器",
          type: "text",
          column: { width: 100 },
        },
        browserVersion: {
          title: "浏览器版本",
          type: "text",
          column: { width: 160 },
        },
        createdTime: {
          title: "创建时间",
          type: "datetime",
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
            version: {
              header: "版号信息",
              columns: ["engineVersion", "browserVersion"],
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
