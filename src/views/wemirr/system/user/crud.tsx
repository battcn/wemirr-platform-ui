import { dict } from "@fast-crud/fast-crud";
import dayjs from "dayjs";
import { DictCode, dictFunc } from "@/api/dict/dict";
import { defHttp } from "@/utils/http/axios";

export default function ({ expose, nodeRef }) {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) => {
          query.orgId = query.orgId > 0 ? null : nodeRef.value?.id;
          return await defHttp.get({ url: `/authority/users`, params: query });
        },
        addRequest: async ({ form }) => await defHttp.post({ url: `/authority/users`, data: form }),
        editRequest: async ({ form }) =>
          await defHttp.put({ url: `/authority/users/${form.id}`, data: form }),
        delRequest: async ({ row }) => await defHttp.delete({ url: `/authority/users/${row.id}` }),
      },
      container: {
        is: "fs-layout-default",
      },
      rowHandle: { fixed: "right" },
      search: {
        onReset() {
          nodeRef.value = null;
        },
      },
      table: {
        scroll: { fixed: true },
        onFilterChange: (content) => {
          const form = expose.getSearchFormData();
          if (content.sex) {
            form.sex = content?.sex[0];
          }
        },
      },
      toolbar: {
        // compact: true,
        // buttons: { compact: { show: false } },
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
          column: { width: 155 },
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
          type: "text",
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
              { min: 6, max: 30, message: "长度在 6 到 30 个字符" },
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
          dict: dictFunc(DictCode.SEX),
          viewForm: {
            valueBuilder(context) {
              context.form.sex = context.row.sex?.toString();
            },
          },
          editForm: {
            valueBuilder(context) {
              context.form.sex = context.row.sex?.toString();
            },
          },
          column: {
            width: 100,
            align: "center",
            filterable: true,
            filterMultiple: false,
            filters: [
              { text: "男", value: 1 },
              { text: "女", value: 2 },
            ],
            sortDirections: ["descend"],
          },
          addForm: {
            value: "1",
          },
        },
        status: {
          title: "状态",
          search: { show: true },
          type: "dict-radio",
          dict: dict({
            data: [
              { value: true, label: "启用", color: "success" },
              { value: false, label: "禁用", color: "error" },
            ],
          }),
          column: { width: 80 },
        },
        email: {
          title: "邮箱",
          type: "text",
          search: { show: true },
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
          column: {
            width: 180,
            component: { color: "auto" },
          },
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
            valueChange({ form, value, getComponentRef }) {
              form.stationId = undefined; // 将“stationId”的值置空
              if (value) {
                // 执行 stationId 的select组件的reloadDict()方法，触发“stationId”重新加载字典
                getComponentRef("stationId")?.reloadDict();
              }
            },
          },
        },
        stationId: {
          title: "岗位",
          type: "dict-select",
          column: { width: 150, component: { color: "auto" } },
          dict: dict({
            cache: true,
            prototype: true,
            value: "id",
            label: "name",
            url({ form }: any) {
              if (form && form.orgId != null) {
                // 本数据字典的url是通过前一个select的选项决定的
                return `/authority/stations?status=1&orgId=${form.orgId}`;
              }
              return undefined;
            },
            getData: ({ form, url }: any) => {
              if (form.orgId) {
                return defHttp.get({ url: url }).then((ret) => {
                  return ret.records;
                });
              }
            },
          }),
          form: {
            component: {
              showSearch: true,
              filterOption: (val: string, form: any) => {
                return form.label.toLowerCase().indexOf(val.toLowerCase()) >= 0;
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
          dict: dictFunc(DictCode.NATION),
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
          dict: dictFunc(DictCode.EDUCATION),
          form: {
            component: {
              showSearch: true,
              filterOption: (val, form) => {
                return form.label.toLowerCase().indexOf(val.toLowerCase()) >= 0;
              },
            },
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
              columns: ["username", "password", "nickName", "sex", "status"],
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
