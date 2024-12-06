import type { ColumnCompositionProps } from '@fast-crud/fast-crud';
import type { FsEditorWang5Config } from '@fast-crud/fast-extends/dist/d/editor/type/config';

import type { App } from 'vue';
import { computed } from 'vue';

import { FastCrud, registerMergeColumnPlugin } from '@fast-crud/fast-crud';
import {
  FsExtendsCopyable,
  FsExtendsEditor,
  FsExtendsInput,
  FsExtendsJson,
  FsExtendsTime,
  FsExtendsUploader,
} from '@fast-crud/fast-extends';
import ui from '@fast-crud/ui-antdv4';
import Antdv from 'ant-design-vue';

import { defHttp } from '#/api/request';

import '@fast-crud/fast-crud/dist/style.css';
import '@fast-crud/ui-antdv4/dist/style.css';
import './setup-fast-crud.less';

// import type _ from "lodash-es";

export function registerFastCrud(app: App) {
  app.use(Antdv);
  app.use(ui);
  app.use(FastCrud, {
    // i18n,
    logger: { off: { tableColumns: false } },
    async dictRequest({ url }: any) {
      return await defHttp.request(url, {});
    },
    commonOptions(props: any) {
      const crudBinding = props.crudExpose?.crudBinding;
      const opts = {
        toolbar: {
          // toolbar.buttons.export.show:false 显示隐藏
          // toolbar.compact:false 默认选择
          compact: false,
          buttons: {
            compact: { show: false },
            export: { show: false },
          },
        },
        search: {
          buttons: {
            search: {
              style: 'marginLeft:-2px',
            },
          },
        },
        actionbar: {
          buttons: {
            add: {
              icon: 'akar-icons:circle-plus',
            },
          },
        },
        container: {
          is: 'fs-layout-card',
        },
        rowHandle: {
          width: 180,
          align: 'left',
          // 固定右侧 不建议设置成全局
          fixed: 'right',
          buttons: {
            view: { order: 1, size: 'small', type: 'link', icon: null },
            edit: { order: 2, size: 'small', type: 'link', icon: null },
            remove: { order: 3, size: 'small', type: 'link', icon: null },
          },
          dropdown: { more: { type: 'link' } },
        },
        table: {
          size: 'small',
          scroll: {
            // 需要设置它，否则滚动条拖动时，表头不会动
            fixed: false,
          },
          pagination: false,
          onResizeColumn: (w: number, col: any) => {
            if (
              crudBinding.value?.table?.columnsMap &&
              crudBinding.value?.table?.columnsMap[col.key]
            ) {
              crudBinding.value.table.columnsMap[col.key].width = w;
            }
          },
        },
        request: {
          transformQuery: ({ page, form, sort }: any) => {
            const order =
              sort === null ? {} : { column: sort.prop, asc: sort.asc };
            const currentPage = page.currentPage ?? 1;
            const limit = page.pageSize ?? 20;
            const offset = limit * (currentPage - 1);
            return {
              offset,
              current: currentPage,
              size: page.pageSize,
              ...form,
              ...order,
            };
          },
          transformRes: ({ res }: any) => {
            if (res.data) {
              return {
                currentPage: Number.parseInt(res.data.current),
                pageSize: Number.parseInt(res.data.size),
                total: Number.parseInt(res.data.total),
                records: res.data.records,
              };
            }
            return {
              currentPage: Number.parseInt(res.current ?? 0),
              pageSize: Number.parseInt(res.size ?? 9999),
              total: Number.parseInt(res.total ?? 9999),
              records: res.records ?? res.data,
            };
          },
        },
        form: {
          display: 'flex',
          wrapper: {
            is: 'a-drawer',
          },
          wrapperCol: {
            span: null,
          },
          labelCol: {
            // 固定label宽度
            span: null,
            style: {
              minWidth: '90px',
            },
          },
          layout: computed(() => {
            // return getLocale.value === LOCALE.ZH_CN ? "horizontal" : "vertical";
            return 'horizontal';
          }),
        },
      };
      // const permission = props.context?.permission || null;
      // const crudPermission = useCrudPermission({ permission });
      // return crudPermission.merge(opts);
      return opts;
    },
  } as any);

  // 安装editor
  app.use(FsExtendsEditor, {
    // 编辑器的公共配置
    wangEditor5: {
      editorConfig: {
        MENU_CONF: {},
      },
      toolbarConfig: {},
    } as FsEditorWang5Config,
  });
  app.use(FsExtendsJson);
  app.use(FsExtendsTime);
  app.use(FsExtendsCopyable);
  app.use(FsExtendsInput);
  // 配置uploader 公共参数
  app.use(FsExtendsUploader, {
    defaultType: 'form',
    form: {
      action: '/tools/files/upload',
      name: 'file',
      withCredentials: false,
      uploadRequest: async ({ action, file, onProgress }) => {
        const data = new FormData();
        data.append('file', file);
        return await defHttp.request(action, {
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60_000,
          data,
          onUploadProgress: (p) => {
            // @ts-ignore
            onProgress({ percent: Math.round((p.loaded / p.total) * 100) });
          },
        });
      },
      successHandle(ret) {
        console.log('文件上传 ==>', ret);
        // 上传完成后的结果处理， 此处后台返回的结果应该为 ret = {code:0,msg:'',data:fileUrl}
        if (!ret.fileId) {
          throw new Error('上传失败');
        }

        return {
          // url: GetGlobPreviewUrl(ret.fileId),
          fileId: ret.fileId,
          key: ret.fileId,
        };
      },
    },
  });

  // 默认宽度，支持自动拖动调整列宽
  registerMergeColumnPlugin({
    name: 'resize-column-plugin',
    order: 2,
    handle: (columnProps: ColumnCompositionProps) => {
      if (!columnProps.column) {
        columnProps.column = {};
      }
      if (columnProps.column.resizable === null) {
        columnProps.column.resizable = true;
        if (!columnProps.column.width) {
          columnProps.column.width = 100;
        }
      }
      return columnProps;
    },
  });

  // 此处演示自定义字段合并插件
  // const { registerMergeColumnPlugin } = useColumns();
  // registerMergeColumnPlugin({
  //     name: "readonly-plugin",
  //     order: 1,
  //     handle: (columnProps: ColumnCompositionProps) => {
  //         // 你可以在此处做你自己的处理
  //         // 比如你可以定义一个readonly的公共属性，处理该字段只读，不能编辑
  //         if (columnProps.readonly) {
  //             // 合并column配置
  //             _.merge(columnProps, {
  //                 form: { show: false },
  //                 viewForm: { show: true },
  //             });
  //         }
  //         if (columnProps.column?.width) {
  //             _.merge(columnProps, {
  //                 column: { resizable: true, ellipsis: true, showTitle: true },
  //             });
  //         }
  //         //resizable: true, ellipsis: true, showTitle: true
  //         return columnProps;
  //     },
  // });
}
