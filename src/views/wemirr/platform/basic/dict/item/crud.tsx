import dayjs from "dayjs";
import {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  dict,
  EditReq,
  UserPageQuery,
  UserPageRes,
} from "@fast-crud/fast-crud";
import { usePermission } from "@/hooks/web/usePermission";
import { defHttp } from "@/utils/http/axios";

export default function ({ context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { hasPermission } = usePermission();
  const { parentIdRef } = context;
  const dictionaryId = parentIdRef.value;
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery): Promise<UserPageRes> => {
          return await defHttp.get({
            url: `/authority/dictionaries/${dictionaryId}/items`,
            params: query,
          });
        },
        addRequest: async ({ form }: AddReq) =>
          await defHttp.post({ url: `/authority/dictionaries/${dictionaryId}/items`, data: form }),
        editRequest: async ({ form }: EditReq) =>
          await defHttp.put({
            url: `/authority/dictionaries/${dictionaryId}/items/${form.id}`,
            data: form,
          }),
        delRequest: async ({ row }: DelReq) =>
          await defHttp.delete({ url: `/authority/dictionaries/${dictionaryId}/items/${row.id}` }),
      },
      actionbar: {
        buttons: {
          add: {
            show: false,
          },
          addRow: {
            show: true,
          },
        },
      },
      search: {
        show: false,
        initialForm: {
          parentId: parentIdRef,
        },
      },
      toolbar: {
        buttons: {
          refresh: {
            show: false,
          },
        },
      },
      table: {
        editable: {
          enabled: true,
          mode: "row",
          activeDefault: false,
        },
      },
      rowHandle: {
        width: 180,
        align: "center",
        group: {
          editable: {
            //自由编辑模式
          },
          editRow: {
            //行编辑模式
            edit: {
              size: "small",
              type: "link",
            },
            save: { size: "small", type: "link" }, //保存
            cancel: { size: "small", type: "link" }, //退出编辑
            remove: {
              size: "small",
              type: "link",
              show: hasPermission("sys:dict:remove"),
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
        dictionaryId: {
          title: "字典ID",
          type: "text",
          form: { show: false },
          column: { show: false },
        },
        label: {
          title: "名称",
          search: { show: true },
          type: "text",
          form: {
            rules: [{ required: true, message: "编码不能为空" }],
          },
        },
        value: {
          title: "值",
          search: { show: false },
          type: "text",
          form: {
            rules: [{ required: true, message: "编码不能为空" }],
          },
        },
        status: {
          title: "状态",
          type: "dict-radio",
          search: { show: true },
          dict: dict({
            data: [
              { value: 1, label: "启用", color: "success" },
              { value: 0, label: "禁用", color: "error" },
            ],
          }),
          addForm: { value: 1 },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = value === true ? 1 : 0;
            }
          },
        },
        sequence: {
          title: "排序",
          type: "number",
          addForm: { value: 0 },
          column: { sorter: true },
          form: { component: { min: 0, max: 100 } },
        },
        description: {
          title: "描述",
          type: ["textarea"],
          form: {
            col: {
              span: 24,
            },
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
