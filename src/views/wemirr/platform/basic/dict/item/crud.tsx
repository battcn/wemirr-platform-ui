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
import { defHttp } from "@/utils/http/axios";

export default function (props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery): Promise<UserPageRes> => {
          return await defHttp.get({
            url: `iam/dict/${query.dictId}/items`,
            params: query,
          });
        },
        addRequest: async ({ form }: AddReq) =>
          await defHttp.post({
            url: `iam/dict/${form.dictId}/items`,
            data: form,
          }),
        editRequest: async ({ form }: EditReq) =>
          await defHttp.put({
            url: `iam/dict/${form.dictId}/items/${form.id}`,
            data: form,
          }),
        delRequest: async ({ row }: DelReq) =>
          await defHttp.delete({
            url: `iam/dict/${row.dictId}/items/${row.id}`,
          }),
      },
      actionbar: { buttons: { add: { show: false } } },
      toolbar: { buttons: { refresh: { show: false } } },
      rowHandle: { width: 180, align: "center" },
      columns: {
        id: {
          title: "ID",
          type: "text",
          form: { show: false },
          column: { show: false },
        },
        dictId: {
          title: "字典ID",
          type: "text",
          form: { show: false },
          column: { show: false },
        },
        label: {
          title: "名称",
          search: { show: true },
          column: { show: true, width: 180 },
          type: "text",
          form: {
            rules: [{ required: true, message: "编码不能为空" }],
          },
        },
        value: {
          title: "值",
          search: { show: false },
          column: { show: true, width: 180 },
          type: "text",
          form: {
            rules: [{ required: true, message: "编码不能为空" }],
          },
        },
        status: {
          title: "状态",
          type: "dict-radio",
          column: { show: true, width: 80 },
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
          column: { show: true, width: 80 },
          form: { component: { min: 0, max: 1000 } },
        },
        description: {
          title: "描述",
          column: { show: false, width: 100 },
          type: ["textarea"],
          form: { col: { span: 24 } },
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
