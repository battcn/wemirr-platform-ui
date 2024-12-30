import { dict, useColumns, useUi } from '@fast-crud/fast-crud';

import * as api from './api';

export default function crud(callbackFunc: () => void): any {
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
          col: { span: 12 },
          rules: [{ required: true, message: '名称不能为空' }],
        },
      },
      type: {
        title: '类型',
        type: 'dict-radio',
        column: { show: true, width: 100 },
        dict: dict({
          data: [
            { value: 0, label: '平台字典', color: 'success' },
            { value: 1, label: '租户字典', color: 'error' },
          ],
        }),
      },
      code: {
        title: '编码',
        search: { show: true },
        type: 'text',
        column: { show: true, width: 200 },
        editForm: { component: { disabled: true } },
        form: {
          col: { span: 12 },
          rules: [{ required: true, message: '编码不能为空' }],
        },
      },
      sequence: {
        title: '排序',
        type: 'number',
        column: { show: true, width: 80 },
        form: { component: { min: 0, max: 1000 } },
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
      doSubmit({ form }: any) {
        if (form.id) {
          api.UpdateObj(form).then(() => {
            callbackFunc();
            ui.notification.success({
              message: '修改成功',
            });
          });
        } else {
          api.AddObj(form).then(() => {
            callbackFunc();
            ui.notification.success({
              message: '新增成功',
            });
          });
        }
      },
    },
  });
}
