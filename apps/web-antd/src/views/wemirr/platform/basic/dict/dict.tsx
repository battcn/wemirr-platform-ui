import { useColumns, useUi } from '@fast-crud/fast-crud';

import * as api from './api';

export default function (callbackFunc: () => void): any {
  const { ui } = useUi();
  // 自定义表单配置
  const { buildFormOptions } = useColumns();
  // 使用crudOptions结构来构建自定义表单配置
  return buildFormOptions({
    columns: {
      id: {
        title: 'ID',
        type: 'text',
        column: { show: false, width: 200 },
        form: { show: false, width: 200 },
      },
      name: {
        title: '名称',
        search: { show: true },
        type: 'text',
        column: { show: true, width: 200 },
        form: {
          col: { span: 13 },
          rules: [{ required: true, message: '名称不能为空' }],
        },
      },
      // avatar: {
      //   title: "头像上传",
      //   type: "avatar-uploader",
      //   form: {
      //     order: 1,
      //     col: {
      //       style: { gridRow: "span 3" }
      //     },
      //     helper: "通过grid布局，可以实现比flex更加规整的排列"
      //   }
      // },

      code: {
        title: '编码',
        search: { show: true },
        type: 'text',
        column: { show: true, width: 200 },
        editForm: { component: { disabled: true } },
        form: {
          col: { span: 13 },
          rules: [{ required: true, message: '编码不能为空' }],
        },
      },
      description: {
        title: '描述',
        type: ['textarea'],
        form: {
          col: { span: 24 },
        },
      },
    },
    form: {
      wrapper: {
        is: 'a-modal',
        title: '新增字典',
      },
      doSubmit({ form }) {
        if (form.id) {
          api.UpdateObj(form).then((ret) => {
            callbackFunc();
            ui.notification.success({
              message: '修改成功',
              duration: 3,
            });
          });
        } else {
          api.AddObj(form).then((ret) => {
            callbackFunc();
            ui.notification.success({
              message: '新增成功',
              duration: 3,
            });
          });
        }
      },
    },
  });
}
