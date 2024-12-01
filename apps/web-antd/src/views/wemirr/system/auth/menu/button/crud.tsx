import * as api from "../api";
import type { CreateCrudOptionsProps, CreateCrudOptionsRet, UserPageQuery, UserPageRes } from "@fast-crud/fast-crud";
import { dict } from "@fast-crud/fast-crud";

export default function (props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { parentId } = props.context;
  // const { search } = crudBinding.value;
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery): Promise<UserPageRes> => {
          query.type = 2;
          query.parentId = parentId.value;
          return await api.GetResourceList(query) as UserPageRes;
        },
        addRequest: async ({ form }) => await api.AddObj(form),
        editRequest: async ({ form }) => await api.UpdateObj(form),
        delRequest: async ({ row }) => await api.DelObj(row.id),
      },
      toolbar: { show: false },
      container: { is: "fs-layout-default" },
      actionbar: { buttons: { add: { show: false } } },
      table: { size: "small", scroll: { fixed: true } },
      search: { show: false },
      buttons: { show: false },
      rowHandle: {
        align: 'center',
        width: 125,
        dropdown: {
          more: {
            icon: null,
            text: '操作',
          }
        },
        buttons:{
          // view: { dropdown: true },
          edit: { dropdown: true },
          remove: { dropdown: true }
        }
      },
      columns: {
        id: {
          title: "ID",
          type: "number",
          column: { show: false },
          form: { show: false },
        },
        parentId: {
          title: "父ID",
          type: "text",
          column: { show: false },
          form: {
            show: false,
            component: { disabled: true },
            rules: [{ required: true, message: "请选择菜单后操作" }],
          },
        },
        type: {
          title: "类型",
          type: "dict-select",
          column: { show: false },
          dict: dict({
            data: [
              { value: 1, label: "菜单" },
              { value: 2, label: "按钮" },
            ],
          }),
          // addForm: { value: 2 },
          form: { value: 2, show: false, component: { disabled: true } },
        },
        label: {
          title: "名称",
          type: "text",
          column: { width: 130, ellipsis: true },
          form: {
            rules: [{ required: true, message: "请填写资源名称" }],
          },
        },
        permission: {
          title: "编码",
          type: "text",
          form: {
            component: {
              placeholder: "资源权限编码",
            },
            rules: [{ required: true, message: "请填写资源权限编码" }],
            helper: "如（user:management:add user:management:edit）",
          },
          column: { width: 200, ellipsis: true },
        },
        sequence: {
          title: "排序",
          type: "number",
          column: { width: 50, align: "center", show: false },
          addForm: { value: 0 },
          form: { component: { min: 0, max: 100 } },
        },
        description: {
          title: "描述",
          column: { show: false, ellipsis: true },
          type: ["textarea"],
          form: { col: { span: 24 } },
        },
      },
    },
  };
}
