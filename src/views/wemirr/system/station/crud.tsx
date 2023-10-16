import { GET, POST, PUT, DELETE } from "@/api/service";
import { dict } from "@fast-crud/fast-crud";
import dayjs from "dayjs";

export default function ({ expose, nodeRef }) {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query) => {
          query.orgId = query.orgId > 0 ? null : nodeRef.value?.id;
          return await GET(`/authority/stations`, query);
        },
        addRequest: async ({ form }) => {
          return await POST(`/authority/stations`, form);
        },
        editRequest: async ({ form }) => {
          return await PUT(`/authority/stations/${form.id}`, form);
        },
        delRequest: async ({ row }) => {
          return await DELETE(`/authority/stations/${row.id}`);
        },
      },
      search: {
        onReset() {
          nodeRef.value = null;
        },
      },
      table: {
        scroll: { fixed: true },
        size: "small",
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
          column: { width: 150 },
          search: { show: true },
          form: {
            rules: [
              { required: true, message: "岗位名称不能为空" },
              { min: 1, max: 30, message: "长度在 1 到 30 个字符" },
            ],
          },
        },
        code: {
          title: "编码",
          type: "text",
          column: { width: 70 },
        },
        type: {
          column: { width: 90 },
          title: "类型",
          type: "dict-select",
          search: { show: true },
          dict: dict({
            url: "/authority/dictionaries/STATION_TYPE/list",
          }),
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = value?.toString();
            }
          },
          form: {
            rules: [{ required: true, message: "岗位类型不能为空" }],
          },
        },
        sequence: {
          title: "排序",
          column: { width: 80, align: "center", show: false },
          type: "number",
          addForm: {
            value: 0,
            component: { min: 0, max: 100 },
          },
          editForm: { component: { min: 0, max: 100 } },
        },
        status: {
          title: "状态",
          type: "dict-radio",
          column: { width: 80, align: "center" },
          search: { show: true },
          addForm: {
            value: 1,
          },
          dict: dict({
            data: [
              { value: true, label: "启用", color: "success" },
              { value: false, label: "禁用", color: "error" },
            ],
          }),
        },
        orgId: {
          title: "组织",
          column: { width: 200, component: { color: "auto" } },
          type: "dict-tree",
          dict: dict({
            isTree: true,
            url: "/authority/org/trees",
            value: "id",
            label: "name",
          }),
          form: {
            component: {
              fieldNames: { children: "children", title: "name", key: "id", value: "id" },
              showSearch: true,
              filterTreeNode: (val, treeNode) => {
                return treeNode.props.title.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
            col: { span: 24 },
            rules: [{ required: true, message: "组织名称不能为空" }],
          },
        },
        description: {
          title: "描述",
          search: { show: false },
          type: ["textarea"],
          form: {
            col: { span: 24 },
          },
          column: { width: 150, ellipsis: true },
        },
        createdTime: {
          title: "创建时间",
          type: "datetime",
          column: { width: 170, sorter: true, align: "center" },
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
