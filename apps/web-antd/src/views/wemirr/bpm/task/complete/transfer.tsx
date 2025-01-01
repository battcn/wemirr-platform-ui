import { dict } from '@fast-crud/fast-crud';
import { notification } from 'ant-design-vue';

import { getUserByIds } from '#/api/core/user';
import { defHttp } from '#/api/request';
import userCrudOptions from '#/views/wemirr/system/user/crud';

export default function crud({ taskId, type, crudExposeRef, dialogShow }: any) {
  return {
    crudOptions: {
      form: {
        labelCol: { span: null, style: { minWidth: '80px' } },
        async doSubmit({ form }: any) {
          await defHttp
            .put(`/bpm/process_tasks/${taskId}/transfer`, form)
            .then(() => {
              dialogShow.value = false;
              notification.success({ message: '转办成功', duration: 3 });
              crudExposeRef.value.doRefresh();
            });
        },
        wrapper: {
          is: 'a-drawer',
          buttons: {
            reset: { show: false },
            cancel: { show: true, text: '关闭' },
          },
        },
      },
      columns: {
        userId: {
          title: '代办人员',
          search: { show: true },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'nickName',
            getNodesByValues: async (values: any[]) => {
              return await getUserByIds(values);
            },
          }),
          column: { width: 180, component: { color: 'auto' } },
          form: {
            rules: [{ required: true, message: '请选择代办人员' }],
            component: {
              crossPage: true,
              createCrudOptions: userCrudOptions,
              crudOptionsOverride: {
                toolbar: { show: false },
                actionbar: { buttons: { add: { show: false } } },
                rowHandle: { show: false },
              },
            },
          },
        },
        remark: {
          title: '内容',
          type: 'textarea',
          column: { ellipsis: true, width: 300 },
          form: {
            col: { span: 24 },
          },
        },
        attachment: {
          title: '附件',
          type: 'file-uploader',
          column: { show: false },
          form: {
            show: false,
            component: {
              uploader: {
                type: 'form',
                buildUrl(res: any) {
                  return res.url;
                },
              },
            },
            helper: '附件请勿上传过大,否则时间会比较忙',
          },
        },
      },
    },
  };
}
