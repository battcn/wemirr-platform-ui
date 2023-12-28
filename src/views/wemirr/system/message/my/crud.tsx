import { ref } from "vue";
import { dict } from "@fast-crud/fast-crud";
import dayjs from "dayjs";
import * as api from "./api";
import { DictCode, dictFunc } from "@/api/dict/dict";

export default function () {
  const selectedRowKeys = ref([]);

  const onSelectChange = (changed: any) => {
    selectedRowKeys.value = changed;
  };

  return {
    selectedRowKeys,
    crudOptions: {
      table: {
        rowSelection: {
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        },
      },
      request: {
        pageRequest: async (query: any) => await api.PageList(query),
        delRequest: async ({ row }) => await api.DelObj(row.id),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {
          add: {
            show: false,
          },
        },
      },
      rowHandle: {
        buttons: {
          edit: { show: false },
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
          search: { show: true, width: 230 },
        },
        level: {
          title: "级别",
          type: "dict-select",
          search: { show: true },
          column: { show: true, width: 130 }, // 表单配置
          dict: dictFunc(DictCode.NOTICE),
        },
        mark: {
          title: "状态",
          search: { show: true },
          column: { show: true, align: "center", width: 100 }, // 表单配置
          type: "dict-radio",
          dict: dict({
            data: [
              { value: true, label: "已读", color: "success" },
              { value: false, label: "未读", color: "error" },
            ],
          }),
        },
        content: {
          title: "消息内容",
          type: "editor-wang",
          column: {
            ellipsis: true,
          },
          form: {
            col: { span: 24 },
          },
        },
        createdTime: {
          title: "通知时间",
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
