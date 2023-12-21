import { defHttp } from "@/utils/http/axios";
import { FastCrud, setLogger } from "@fast-crud/fast-crud";
import "@fast-crud/fast-crud/dist/style.css";
import { FsExtendsEditor, FsExtendsJson, FsExtendsUploader } from "@fast-crud/fast-extends";
import { useLocale } from "@/locales/useLocale";
import "@fast-crud/fast-extends/dist/style.css";
import UiAntdv from "@fast-crud/ui-antdv4";
import { useCrudPermission } from "@/plugin/permission/use-crud-permission";
import { computed } from "vue";
import { LOCALE } from "@/settings/localeSetting";

const { getLocale } = useLocale();
// const globSetting = useGlobSetting()
// import { isDevMode } from '@/utils/env'
// 导出 setupFastCrud
// 国际化配置见 /src/locales/en  or zh_CN
export default function (app, i18n) {
  //先安装ui
  app.use(UiAntdv);
  setLogger({ level: "warn" });
  //再安装fast-crud
  app.use(FastCrud, {
    i18n,
    logger: { off: { tableColumns: false } },
    async dictRequest({ url }) {
      return await defHttp.request({ url });
    },
    commonOptions: function (context) {
      const opts = {
        toolbar: {
          // toolbar.buttons.export.show:false 显示隐藏
          // toolbar.compact:false 默认选择
          compact: false,
          buttons: {
            compact: {
              show: false,
            },
          },
        },
        search: {
          buttons: {
            search: {
              style: "marginLeft:-2px",
            },
          },
        },
        actionbar: {
          buttons: {
            add: {
              icon: "akar-icons:circle-plus",
            },
          },
        },
        container: {
          is: "fs-layout-card",
        },
        rowHandle: {
          width: 180,
          align: "left",
          // 固定右侧 不建议设置成全局
          fixed: "right",
          buttons: {
            view: { size: "small", type: "link", icon: null },
            edit: { size: "small", type: "link", icon: null },
            remove: { size: "small", type: "link", icon: null },
          },
          dropdown: {
            more: {
              type: "link",
            },
          },
        },
        table: {
          size: "small",
          scroll: {
            //需要设置它，否则滚动条拖动时，表头不会动
            fixed: false,
          },
          pagination: false,
        },
        request: {
          transformQuery: ({ page, form, sort }) => {
            const order = sort == null ? {} : { column: sort.prop, asc: sort.asc };
            const currentPage = page.currentPage ?? 1;
            const limit = page.pageSize ?? 20;
            const offset = limit * (currentPage - 1);
            return {
              offset: offset,
              current: currentPage,
              size: page.pageSize,
              ...form,
              ...order,
            };
          },
          transformRes: ({ res }) => {
            if (res.data != null) {
              return {
                currentPage: parseInt(res.data.current),
                pageSize: parseInt(res.data.size),
                total: parseInt(res.data.total),
                records: res.data.records,
              };
            }
            return {
              currentPage: parseInt(res.current ?? 0),
              pageSize: parseInt(res.size ?? 9999),
              total: parseInt(res.total ?? 9999),
              records: res.records ?? res.data,
            };
          },
        },
        form: {
          display: "flex",
          wrapper: {
            is: "a-drawer",
          },
          wrapperCol: {
            span: null,
          },
          labelCol: {
            //固定label宽度
            span: null,
            style: {
              minWidth: "90px",
            },
          },
          layout: computed(() => {
            return getLocale.value === LOCALE.ZH_CN ? "horizontal" : "vertical";
          }),
        },
      };
      const crudPermission = useCrudPermission(context);
      return crudPermission.merge(opts);
    },
  });
  //安装editor
  app.use(FsExtendsEditor, {
    //编辑器的公共配置
    wangEditor: {},
    quillEditor: {},
  });
  app.use(FsExtendsJson);
  //配置uploader 公共参数
  app.use(FsExtendsUploader, {
    defaultType: "form",
    form: {
      action: "/tools/files/upload",
      name: "file",
      withCredentials: false,
      uploadRequest: async ({ action, file, onProgress }) => {
        const data = new FormData();
        data.append("file", file);
        return await defHttp.request({
          url: action,
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
          data,
          onUploadProgress: (p) => {
            // @ts-ignore
            onProgress({ percent: Math.round((p.loaded / p.total) * 100) });
          },
        });
      },
      successHandle(ret) {
        console.log("ret ==> ", ret);
        // 上传完成后的结果处理， 此处后台返回的结果应该为 ret = {code:0,msg:'',data:fileUrl}
        if (!ret.fileId) {
          throw new Error("上传失败");
        }

        return {
          // url: GetGlobPreviewUrl(ret.fileId),
          fileId: ret.fileId,
          key: ret.fileId,
        };
      },
    },
  });
}
