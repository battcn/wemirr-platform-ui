import {compute, dict, useColumns, utils, useUi} from "@fast-crud/fast-crud";
import {message} from "ant-design-vue";
import * as api from "../template/api";
import createCrudOptionsText from "../../user/crud";
import {defHttp} from "#/api/request";

export function createFormOptions() {
    const { ui } = useUi();
    // 自定义表单配置
    const {buildFormOptions} = useColumns();
    //使用crudOptions结构来构建自定义表单配置
    return buildFormOptions({
        columns: {
            code: {
                title: "编码",
                type: "text",
                form: {
                    component: { disabled: true },
                },
            },
            name: {
                title: "名称",
                type: "text",
                form: {
                    component: { disabled: true },
                },
            },
            context: {
                title: "消息内容",
                type: "textarea",
                form: {
                    col: {span: 24},
                    component: { disabled: true },
                },
            },
            type: {
                title: "类型",
                type: "dict-select",
                dict: dict({
                    data: [
                        { value: 0, label: "用户", color: "success" },
                        // { value: 1, label: "角色", color: "error" },
                    ],
                }),
                form:{
                    value: 0,
                }
            },
            subscriberIdList: {
                title: "订阅人",
                type: "table-select",
                dict: dict({
                    value: "id",
                    label: "nickName",
                    //重要，根据value懒加载数据
                    getNodesByValues: async (values: any[]) => {
                        // return await textTableApi.GetByIds(values);
                        return defHttp.post('/iam/users/ids',values);
                    }
                }),
                form: {
                    show: compute(({ form }) => {
                        return form.type === 0;
                    }),
                    component: {
                        crossPage: true,
                        multiple: true,
                        valuesFormat: {
                            labelFormatter: (item: any) => {
                                return `${item.nickName}`;
                            }
                        },
                        select: {
                            placeholder: "点击选择"
                        },
                        createCrudOptions: createCrudOptionsText,
                        // crudOptionsOverride,
                        on: {
                            selectedChange({ $event }) {
                                // console.log("selectedChange", $event);
                                // ui.notification.success(`你选择了${JSON.stringify($event)}`)
                            }
                        }
                    }
                }
            },
            variables: {
                title: "变量",
                type: ["text"],
                column: {
                    show: false,
                    component: { name: "fs-values-format" },
                },
                form: {
                    col: { span: 24 },
                },
            },
            // variables: {
            //     title: "变量",
            //     type: "textarea",
            //     form: {
            //         col: {span: 24},
            //         rules: [{required: true, message: "变量不能为空必填"}]
            //     }
            // }
        },
        form: {
            doSubmit({form}) {
                api.notify(form).then(() => {
                    utils.logger.log("form submit:", form);
                    message.info("自定义表单提交:" + JSON.stringify(form));
                    message.success("保存成功");
                })
            }
        }
    });
}