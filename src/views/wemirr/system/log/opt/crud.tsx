import { GET } from "@/api/service";
// import { compute } from '@fast-crud/fast-crud';
import dayjs from "dayjs";
import { dict, ValueBuilderContext, ValueResolveContext } from "@fast-crud/fast-crud";

export default function ({ expose }) {
  const pageRequest = async (query) => await GET("/authority/opt_logs", query);
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
        width: 80,
        //固定右侧
        fixed: "right",
        buttons: {
          view: { size: "small" },
          edit: { show: false },
          remove: { size: "small", show: false },
        },
      },
      columns: {
        id: {
          title: "ID",
          type: "text",
          column: { show: false },
          viewForm: { show: false },
        },
        ip: {
          title: "IP",
          type: "text",
          column: { show: false },
        },
        location: {
          title: "登录地点",
          type: "text",
          column: { width: 200 },
        },
        actionMethod: {
          title: "请求方法",
          type: "text",
          column: { width: 100 },
          search: { show: true },
        },
        httpMethod: {
          title: "HTTP方式",
          type: "dict-select",
          column: { width: 100, component: { color: "auto" } },
          search: { show: true },
          dict: dict({
            data: [
              { value: "GET", label: "GET" },
              { value: "POST", label: "POST" },
              { value: "PUT", label: "PUT" },
              { value: "DELETE", label: "DELETE" },
              { value: "PATCH", label: "PATCH" },
            ],
          }),
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
        engineVersion: {
          title: "引擎版本",
          type: "text",
          column: { width: 100, component: { color: "auto" } },
        },
        browser: {
          title: "浏览器",
          type: "text",
          column: { width: 100, component: { color: "auto" } },
        },
        browserVersion: {
          title: "浏览器版本",
          type: "text",
          column: { width: 160, component: { color: "auto" } },
        },
        createdName: {
          title: "操作人",
          type: "text",
          column: { width: 180 },
        },
        startTime: {
          title: "开始时间",
          type: "datetime",
          column: { width: 180 },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
        },
        finishTime: {
          title: "结束时间",
          type: "datetime",
          column: { width: 180 },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
        },
        consumingTime: {
          title: "消耗时间",
          type: "text",
          column: { width: 100 },
        },
        description: {
          title: "描述信息",
          type: ["textarea"],
          search: { show: false },
          column: { width: 200 },
          form: {
            col: {
              span: 24,
            },
          },
        },
        result: {
          title: "响应结果",
          type: "json",
          column: { show: false },
          form: {
            col: {
              span: 24,
            },
            valueBuilder({ form }: ValueBuilderContext) {
              if (form.result == null) {
                return;
              }
              form.result = JSON.parse(form.result);
            },
            valueResolve({ form }: ValueResolveContext) {
              if (form.result == null) {
                return;
              }
              form.result = JSON.stringify(form.result);
            },
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
              columns: ["ip", "location"],
            },
            reqInfo: {
              header: "请求信息",
              columns: ["actionMethod", "httpMethod", "platform", "os", "engine", "browser"],
            },
            version: {
              header: "版号信息",
              columns: ["engineVersion", "browserVersion"],
            },
            otherInfo: {
              header: "其它信息",
              columns: [
                "startTime",
                "finishTime",
                "consumingTime",
                "createdName",
                "description",
                "result",
              ],
            },
          },
        },
      },
    },
  };
}
