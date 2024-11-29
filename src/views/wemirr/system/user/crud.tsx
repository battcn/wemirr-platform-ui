import {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  dict,
  UserPageQuery,
} from "@fast-crud/fast-crud";
import dayjs from "dayjs";
import { SysDictCode, sysDictFunc } from "@/api/dict/dict";
import { defHttp } from "@/utils/http/axios";
import { downloadByData } from "@/utils/file/download";
import { useMessage } from "@/hooks/web/useMessage";
import { usePermission } from "@/hooks/web/usePermission";

export default function (props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { notification, createConfirm } = useMessage();
  const { hasPermission } = usePermission();
  const { nodeRef } = props.context;
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) => {
          query.orgId = query.orgId > 0 ? null : nodeRef?.value?.id;
          return await defHttp.post({ url: `iam/users/page`, data: query });
        },
        addRequest: async ({ form }) =>
          await defHttp.post({ url: `iam/users/create`, data: form }),
        editRequest: async ({ form }) =>
          await defHttp.put({ url: `iam/users/${form.id}`, data: form }),
        delRequest: async ({ row }) => await defHttp.delete({ url: `iam/users/${row.id}` }),
      },
      rowHandle: {
        width: 240,
        //固定右侧
        fixed: "right",
        buttons: {
          remove: { order: 2 },
          resetPassword: {
            type: "link",
            order: 1,
            text: "重置密码",
            size: "small",
            title: "重置密码",
            show: hasPermission("sys:user:reset"),
            async click({ row }) {
              createConfirm({
                iconType: "warning",
                title: "风险提示",
                content: `确定重置 [${row.nickName}] 密码吗 ?`,
                onOk: () => {
                  defHttp
                    .put({ url: `iam/users/${row.id}/reset_password` })
                    .then(() => {
                      notification.success({ message: "密码重置成功", duration: 2 });
                    })
                    .catch((ret) => {
                      console.error("异常原因 - ", ret);
                      notification.error({ message: "密码重置异常", duration: 2 });
                    });
                },
              });
            },
          },
        },
      },
      search: {
        onReset(context: any) {
          nodeRef.value = null;
        },
      },
      table: { scroll: { fixed: true } },
      toolbar: {
        export: {
          server: async (userPageQuery: UserPageQuery) => {
            await defHttp
              .request(
                {
                  url: `iam/users/export`,
                  method: "POST",
                  params: userPageQuery,
                  responseType: "blob",
                },
                { isTransformResponse: false },
              )
              .then((res) => {
                downloadByData(res, `用户列表.xlsx`);
              });
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
        username: {
          title: "账号",
          type: "text",

          column: { width: 155, showTitle: true },
          search: { show: true, fixed: "left" },
          editForm: {
            component: { disabled: true },
          },
          form: {
            rules: [
              { required: true, message: "请输入账号名" },
              { min: 4, max: 30, message: "长度在 4 到 30 个字符" },
            ],
          },
        },
        password: {
          title: "密码",
          type: "password",
          column: { show: false },
          viewForm: {
            show: false,
          },
          editForm: {
            show: false,
          },
          form: {
            rules: [
              { required: true, message: "请输入密码" },
              { min: 8, max: 30, message: "长度在 8 到 30 个字符" },
              {
                pattern:
                  /^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{8,30}$/,
                message: "需同时包含大写字母、小写字母、数字和特殊字符",
              },
            ],
          },
        },
        nickName: {
          title: "昵称",
          type: "text",
          column: { width: 155, ellipsis: true },
          search: { show: true, fixed: "left" },
          form: {
            rules: [
              { required: true, message: "请输入昵称" },
              { min: 2, max: 30, message: "长度在 2 到 30 个字符" },
            ],
          },
        },
        mobile: {
          title: "手机号",
          type: "text",
          search: { show: true },
          column: { width: 155, align: "center" },
          form: {
            rules: [
              { required: true, message: "请输入手机号" },
              { pattern: /^1\d{10}$/, message: "手机号格式错误" },
            ],
          },
        },
        sex: {
          title: "性别",
          type: "dict-radio",
          dict: sysDictFunc(SysDictCode.SEX),
          column: { width: 100, align: "center" },
          addForm: { value: "1" },
        },
        status: {
          title: "状态",
          search: { show: true },
          type: "dict-radio",
          // true | false 在 渲染查询控件会有告警 antdv 问题
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = value ? 1 : 0;
            }
          },
          dict: dict({
            data: [
              { value: 1, label: "启用", color: "success" },
              { value: 0, label: "停用", color: "error" },
            ],
          }),
          addForm: { value: 1 },
          column: { width: 80 },
        },
        email: {
          title: "邮箱",
          type: "text",
          search: { show: false },
          column: { width: 180 },
        },
        avatar: {
          title: "头像",
          type: "cropper-uploader",
          column: {
            width: 70,
            align: "center",
            show: false,
          },
          form: {
            component: {
              uploader: {
                type: "qiniu", // 上传后端类型【cos,aliyun,oss,form】
                buildUrl(res) {
                  return res.url;
                },
              },
            },
          },
        },
        orgId: {
          title: "组织",
          type: "dict-tree",
          column: { width: 180, component: { color: "auto" } },
          dict: dict({
            isTree: true,
            url: "iam/org/trees",
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
            valueChange({ form, value, getComponentRef }) {
              form.stationId = undefined;
              if (value) {
                const targetDict = getComponentRef("stationId").getDict();
                targetDict.url = `iam/stations/list?orgId=${value}`;
                targetDict.reloadDict();
              }
            },
          },
        },
        stationId: {
          title: "岗位",
          type: "dict-select",
          column: { width: 150, component: { color: "auto" } },
          dict: dict({
            prototype: false,
            url: "iam/stations/list",
            value: "id",
            label: "name",
          }),
          form: {
            component: {
              dict: { cache: false },
              showSearch: true,
              filterOption: (val: string, form: any) => {
                return form?.label?.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
            helper: "选择组织后才可以选择岗位哟~~~",
          },
        },
        positionStatus: {
          title: "职位状态",
          type: "dict-select",
          column: { width: 90 },
          dict: dict({
            data: [
              { value: "WORKING", label: "在职", color: "success" },
              { value: "QUIT", label: "离职", color: "error" },
              { value: "LEAVE", label: "请假", color: "warning" },
            ],
          }),
        },
        nation: {
          title: "民族",
          type: "dict-select",
          column: { width: 90 },
          dict: sysDictFunc(SysDictCode.NATION),
          form: {
            component: {
              showSearch: true,
              filterOption: (val, form) => {
                return form.label.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
          },
        },
        education: {
          title: "学历",
          search: { show: true },
          type: "dict-select",
          column: { width: 90 },
          dict: sysDictFunc(SysDictCode.EDUCATION),
          form: {
            component: {
              showSearch: true,
              filterOption: (val, form) => {
                return form.label.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
          },
        },
        description: {
          title: "描述",
          column: { show: false },
          type: ["textarea"],
          form: {
            col: { span: 24 },
          },
        },
        createdTime: {
          title: "创建时间",
          type: "datetime",
          column: { width: 180, sorter: true },
          form: {
            show: false,
          },
          editForm: {
            show: false,
          },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
      form: {
        display: "flex",
        group: {
          type: "collapse", // tab
          accordion: false, //手风琴模式
          groups: {
            baseInfo: {
              header: "基础信息",
              columns: ["username", "password", "nickName", "sex", "status", "description"],
            },
            orgInfo: {
              header: "职位信息",
              columns: ["orgId", "stationId", "positionStatus"],
            },
            linkInfo: {
              header: "联系方式",
              columns: ["mobile", "email"],
            },
            otherInfo: {
              header: "其它信息",
              collapsed: false, //默认折叠
              columns: ["nation", "education", "avatar", "createdTime"],
            },
          },
        },
      },
    },
  };
}
