
import type { App } from 'vue';

import FastCrud from '@fast-crud/fast-crud';
import ui from '@fast-crud/ui-antdv4';
import Antdv from 'ant-design-vue';

import '@fast-crud/fast-crud/dist/style.css';
import '@fast-crud/ui-antdv4/dist/style.css';
import './setup-fast-crud.less';
import {computed} from "vue";
import {defHttp} from "#/api/request";

export function registerFastCrud(app: App) {
    app.use(Antdv);
    app.use(ui);
    app.use(FastCrud, {
        // i18n,
        logger: { off: { tableColumns: false } },
        async dictRequest({ url }) {
            return await defHttp.request(url,{});
        },
        commonOptions(props:any) {
            const crudBinding = props.crudExpose?.crudBinding;
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
                    transformQuery: ({ page, form, sort } : any) => {
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
                    transformRes: ({ res } : any) => {
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
                        // return getLocale.value === LOCALE.ZH_CN ? "horizontal" : "vertical";
                        return "horizontal";
                    }),
                },
            };
            // const permission = props.context?.permission || null;
            // const crudPermission = useCrudPermission({ permission });
            // return crudPermission.merge(opts);
            return opts;
        },
    });
}