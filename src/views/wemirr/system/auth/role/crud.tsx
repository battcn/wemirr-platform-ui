import { dict } from "@fast-crud/fast-crud";
import dayjs from "dayjs";
import { usePermission } from "@/hooks/web/usePermission";
import { GET, POST, PUT, DELETE } from "@/api/service";

export default function ({ expose, distribution }) {
  const { hasPermission } = usePermission();
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => await GET(`/authority/roles`, query),
        addRequest: async ({ form }) => await POST(`/authority/roles`, form),
        editRequest: async ({ form }) => await PUT(`/authority/roles/${form.id}`, form),
        delRequest: async ({ row }) => await DELETE(`/authority/roles/${row.id}`),
      },
      table: {
        size: "small",
        scroll: {
          //需要设置它，否则滚动条拖动时，表头不会动
          fixed: true,
        },
      },
      rowHandle: {
        show: true,
        width: 220,
        dropdown: {
          // 操作列折叠
          atLeast: 2,
          more: {
            size: "small",
            text: "",
            icon: "gg:more-o",
          },
        },
        buttons: {
          distribution: {
            text: "分配用户",
            size: "small",
            order: 4,
            show: hasPermission("sys:roles:distribution:user"),
            async click(context) {
              await distribution.userModal(context.record.id);
            },
          },
          resource: {
            text: "分配权限",
            size: "small",
            order: 5,
            show: hasPermission("sys:roles:distribution:res"),
            async click(context) {
              await distribution.resourceModal(context.record.id);
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
        name: {
          title: "名称",
          type: "text",
          column: { width: 180 },
          search: { show: true },
        },
        code: {
          title: "编码",
          type: "text",
          column: { width: 180 },
          form: {
            rules: [
              { required: true, message: "请输入编码" },
              { min: 2, max: 30, message: "长度在 2 到 30 个字符" },
            ],
          },
        },
        readonly: {
          title: "内置角色",
          type: "dict-radio",
          column: { width: 90, align: "center" },
          addForm: { show: false },
          editForm: {
            component: {
              disabled: true,
            },
          },
          dict: dict({
            data: [
              { value: true, label: "是", color: "success" },
              { value: false, label: "否", color: "error" },
            ],
          }),
        },
        locked: {
          title: "状态",
          type: "dict-radio",
          search: { show: true },
          column: { width: 100, align: "center" },
          form: { disabled: true },
          dict: dict({
            data: [
              { value: "false", label: "启用", color: "success" },
              { value: "true", label: "禁用", color: "error" },
            ],
          }),
        },
        scopeType: {
          title: "权限范围",
          search: { show: true },
          type: "dict-select",
          column: { width: 150 },
          dict: dict({
            data: [
              { value: 10, label: "个人", color: "warning" },
              { value: 20, label: "自定义", color: "error" },
              { value: 30, label: "本级", color: "warning" },
              { value: 40, label: "本级及子级", color: "success" },
              { value: 50, label: "全部", color: "success" },
            ],
          }),
          form: {
            component: { radioName: "a-radio-button" },
            valueChange: ({ value, form, ...content }) => {
              console.log("value", value, "form", form, "content", content);
            },
          },
        },
        description: {
          title: "描述",
          search: { show: false },
          column: { width: 170, ellipsis: true },
          type: ["textarea"],
          form: {
            col: { span: 24 },
          },
        },
        orgList: {
          search: { show: false },
          column: { show: false },
        },
        createdTime: {
          title: "创建时间",
          type: "datetime",
          column: { width: 180, sorter: true },
          addForm: { show: false },
          editForm: { show: false },
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
