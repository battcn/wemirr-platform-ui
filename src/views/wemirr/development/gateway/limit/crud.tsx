import * as api from "./api";
import { dict, utils } from "@fast-crud/fast-crud";
import dayjs from "dayjs";

export default function () {
  const pageRequest = async (query) => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.id);
  };

  const addRequest = async ({ form }) => {
    return await api.AddObj(form);
  };
  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      columns: {
        id: {
          title: "ID",
          type: "text",
          form: { show: false },
          column: { show: false },
        },
        range: {
          title: "范围",
          type: "dict-select",
          search: { show: true },
          column: { width: 100 },
          dict: dict({
            data: [
              { label: "全局", value: 0, color: "success" },
              { label: "IP", value: 1, color: "success" },
            ],
          }),
          addForm: {
            value: 0,
          },
          form: {
            rules: [{ required: true, message: "限流类型不能为空" }],
            helper: "全局表示所有IP访问,IP表示每隔间断访问",
          },
        },
        total: {
          title: "数量",
          type: "number",
          column: { show: true, width: 100 },
          addForm: { value: 10 },
          form: {
            component: {
              min: 10,
              max: 9999999,
            },
            rules: [{ required: true, message: "限流数量不能为空" }],
          },
        },
        visits: {
          title: "访问量",
          type: "number",
          column: { show: true, width: 120 },
          form: { show: false },
        },
        status: {
          title: "状态",
          type: "dict-radio",
          column: { show: true, width: 120 },
          addForm: {
            value: true,
          },
          search: { show: true },
          dict: dict({
            data: [
              { value: true, label: "启用", color: "success" },
              { value: false, label: "禁用", color: "error" },
            ],
          }),
        },
        blacklist: {
          title: "进黑名单",
          type: "dict-radio",
          column: { show: true, width: 120 },
          addForm: {
            value: true,
          },
          search: { show: true },
          dict: dict({
            data: [
              { value: true, label: "是", color: "success" },
              { value: false, label: "否", color: "error" },
            ],
          }),
        },
        method: {
          title: "方法",
          type: "dict-select",
          column: { show: true, width: 120 },
          search: { show: true },
          dict: dict({
            data: [
              { label: "ALL", value: "ALL", color: "success" },
              { label: "GET", value: "GET", color: "success" },
              { label: "POST", value: "POST", color: "success" },
              { label: "PUT", value: "PUT", color: "success" },
              { label: "DELETE", value: "DELETE", color: "error" },
              { label: "PATCH", value: "PATCH", color: "success" },
            ],
          }),
          form: {
            rules: [{ required: true, message: "请选择拦截方法" }],
          },
        },
        path: {
          title: "路径",
          type: "text",
          form: {
            helper: "如果为空默认拦截所有",
          },
          column: {
            ellipsis: true,
          },
        },
        dateTimeRange: {
          title: "限时范围",
          type: "datetimerange",
          valueBuilder({ row, key }) {
            if (!utils.strings.hasEmpty(row.startTime, row.endTime)) {
              row[key] = [dayjs(row.startTime), dayjs(row.endTime)];
            }
          },
          valueResolve({ form, key }) {
            const row = form;
            if (row[key] != null && !utils.strings.hasEmpty(row[key])) {
              row.startTime = row[key][0];
              row.endTime = row[key][1];
            } else {
              row.startTime = null;
              row.endTime = null;
            }
          },
          form: {
            col: { span: 24 },
          },
        },
        description: {
          title: "描述",
          type: "textarea",
          search: { show: false },
          form: {
            col: { span: 24 },
          },
          column: {
            ellipsis: true,
          },
        },
        createdTime: {
          title: "创建时间",
          type: "datetime",
          column: { width: 180 },
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
