import DictItemTable from "./item/index.vue";
import {
  dict,
  compute,
  CreateCrudOptionsRet,
  UserPageQuery,
  UserPageRes,
  EditReq,
  DelReq,
  AddReq,
} from "@fast-crud/fast-crud";
import dayjs from "dayjs";
import { defHttp } from "@/utils/http/axios";
import { usePermission } from "@/hooks/web/usePermission";

export default function (): CreateCrudOptionsRet {
  const { hasPermission } = usePermission();
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery): Promise<UserPageRes> =>
          await defHttp.get({ url: `/authority/dictionaries`, params: query }),
        addRequest: async ({ form }: AddReq) =>
          await defHttp.post({ url: `/authority/dictionaries`, data: form }),
        editRequest: async ({ form }: EditReq) =>
          await defHttp.put({ url: `/authority/dictionaries/${form.id}`, data: form }),
        delRequest: async ({ row }: DelReq) =>
          await defHttp.delete({ url: `/authority/dictionaries/${row.id}` }),
      },
      rowHandle: {
        width: 220,
        buttons: {
          remove: {
            show: compute(({ row }) => {
              return !row.readonly && hasPermission("sys:dict:remove");
            }),
          },
          refresh: {
            text: "刷新缓存",
            size: "small",
            type: "link",
            order: 2,
            show: hasPermission("sys:dict:refresh"),
            click: async function ({ row }) {
              await defHttp.get({ url: `/authority/dictionaries/${row.code}/refresh` });
            },
          },
        },
      },
      form: {
        wrapper: {
          width: "70%",
          // is: "a-modal",
        },
      },
      columns: {
        name: {
          title: "名称",
          search: { show: true },
          type: "text",
          column: { show: true, width: 200 },
          form: {
            rules: [{ required: true, message: "编码不能为空" }],
          },
        },
        code: {
          title: "编码",
          search: { show: true },
          type: "text",
          column: { show: true, width: 200 },
          form: {
            rules: [{ required: true, message: "编码不能为空" }],
          },
        },
        status: {
          title: "状态",
          type: "dict-radio",
          search: { show: true },
          column: { show: true, width: 100, align: "center" },
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
        readonly: {
          title: "内置",
          type: "dict-radio",
          column: { width: 100, align: "center" },
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
        description: {
          title: "描述",
          type: ["textarea"],
          form: {
            col: { span: 24 },
          },
        },
        createdTime: {
          title: "创建时间",
          type: "datetime",
          form: { show: false },
          column: { show: true, width: 180 },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
        },
        dictItem: {
          title: "字典信息",
          type: "text",
          column: { show: false },
          form: {
            component: {
              name: DictItemTable,
              id: compute(({ form }) => {
                return form.id;
              }),
            },
            col: { span: 24 },
          },
        },
      },
    },
  };
}
