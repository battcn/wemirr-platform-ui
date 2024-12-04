import {compute, dict, useColumns, useUi} from "@fast-crud/fast-crud";
import createCrudOptionsText from "../user/crud";
import {defHttp} from "#/api/request";

export function createFormOptions() {
    const {ui} = useUi();
    // 自定义表单配置
    const {buildFormOptions} = useColumns();
    //使用crudOptions结构来构建自定义表单配置
    return buildFormOptions({
        columns: {
            code: {
                title: "编码",
                type: "text",
                form: {
                    component: {disabled: true},
                },
            },
            name: {
                title: "名称",
                type: "text",
                form: {
                    component: {disabled: true},
                },
            },
            content: {
                title: "消息内容",
                type: "textarea",
                form: {
                    col: {span: 24},
                    component: {disabled: true},
                },
            },
            type: {
                title: "类型",
                type: "dict-select",
                dict: dict({
                    data: [
                        {value: 0, label: "用户", color: "success"},
                        // { value: 1, label: "角色", color: "error" },
                    ],
                }),
                form: {
                    value: 0,
                    rules: [{required: true, message: "订阅类型不能为空"}],
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
                        return defHttp.post('/iam/users/ids', values);
                    }
                }),
                form: {
                    rules: [{required: true, message: "订阅人不能为空"}],
                    show: compute(({form}) => {
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
                        crudOptionsOverride: {
                            toolbar: {show: false},
                            actionbar: {buttons: {add: {show: false}}},
                            rowHandle: {
                                show: false,
                            },
                            columns: {
                                username: {column: {show: false}},
                                status: {column: {show: false}},
                                nation: {column: {show: false}},
                                education: {column: {show: false}},
                                positionId: {column: {show: false}},
                            },
                        },
                        on: {
                            selectedChange({$event}) {
                                console.log("selectedChange", $event);
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
                    component: {name: "fs-values-format"},
                },
                form: {
                    col: {span: 24},
                },
            },
        },
        form: {
            doSubmit({form}) {
                defHttp.post("/iam/message-template/notify", form).then(() => {
                    ui.notification.success("消息推送成功")
                })
            }
        }
    });
}