import { ref } from "vue";
import { dict } from "@fast-crud/fast-crud";
import { GET, DELETE } from "@/api/service";
import { useRouter } from "vue-router";

export default function ({ expose }) {
  const selectedRowKeys = ref([]);
  const router = useRouter();

  const onSelectChange = (changed) => {
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
        pageRequest: async (query) => await GET(`/authority/site_messages/my`, query),
        delRequest: async ({ row }) => await DELETE(`/authority/site_messages/my/${row.id}`),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {
          add: {
            show: false,
          },
          publish: {
            icon: "codicon:repo-force-push",
            type: "button",
            text: "新建模型",
            title: "新建模型",
            async click() {
              await router.push("/design/process/workflow");
            },
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
          search: { show: true },
        },
        mark: {
          title: "状态",
          search: { show: true },
          column: { show: true, align: "center" }, // 表单配置
          type: "dict-radio",
          dict: dict({
            data: [
              { value: true, label: "已读", color: "success" },
              { value: false, label: "未读", color: "error" },
            ],
          }),
        },
      },
    },
  };
}
