import * as api from "./api";
import {dict, utils} from "@fast-crud/fast-crud";
import type {CreateCrudOptionsProps, CreateCrudOptionsRet} from "@fast-crud/fast-crud";
import dayjs from "dayjs";
import {useRouter} from "vue-router";

export default function (props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  utils.logger.info("crud props", props);
  const router = useRouter();

  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) => await api.GetList(query),
        addRequest: async ({ form }: any) => await api.AddObj(form),
        editRequest: async ({ form }: any) => await api.UpdateObj(form),
        delRequest: async ({ row }: any) => await api.DelObj(row.id),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {
          add: {
            icon: "ph:plus-fill",
            text: "添加模板",
          },
        },
      },
      rowHandle: {
        width: 230,
        buttons: {
          publish: {
            // icon: "arcticons:efa-publish",
            order: 2,
            type: 'link',
            text: "推送",
            async click({ row }: any) {
              // props.context.openPublishFormWrapper(row);
              utils.logger.info("click publish row => ", row);
              await router.push(`/sys/message/publish?code=${row.code}&name=${row.name}`);
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
        code: {
          title: "编码",
          type: "text",
          column: { show: true, width: 100 },
          form: {
            rules: [{ required: true, message: "模板编码不能为空" }],
          },
        },
        name: {
          title: "名称",
          type: "text",
          column: { show: true, width: 160 },
          search: { show: true },
          form: {
            rules: [{ required: true, message: "模板名称不能为空" }],
          },
        },
        type: {
          title: "类型",
          search: { show: true },
          column: { show: true, align: "center", width: 160 },
          type: "dict-select",
          dict: dict({
            data: [
              { value: 'system', label: "系统消息" },
              { value: 'ding-talk', label: "钉钉" },
              { value: 'email', label: "邮箱" },
              { value: 'sms', label: "短信" },
            ],
          }),
          addForm: {
            value: 'system',
          },
        },
        subject: {
          title: "消息标题",
          type: "text",
          column: { show: true, width: 200 },
          search: { show: true },
          form: {
            col: { span: 24 },
          },
        },
        content: {
          title: "模板内容",
          type: "textarea",
          column: { ellipsis: true, width: 200 },
          form: {
            col: { span: 24 },
            rules: [{ required: true, message: "模板内容不能为空" }],
          },
        },
        createdName: {
          title: "发布人",
          type: "text",
          column: { show: false, width: 180 },
          form: { show: false },
        },
        createdTime: {
          title: "通知时间",
          type: "datetime",
          column: { show: true, width: 180 },
          form: { show: false },
          valueBuilder({ value, row, key }: any) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
    },
  };
}
