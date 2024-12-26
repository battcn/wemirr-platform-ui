// import { GetGlobPreviewUrl } from '#/api/sysPrefix';
import { compute } from '@fast-crud/fast-crud';
import { notification } from 'ant-design-vue';

import { defHttp } from '#/api/request';

export default function crud({ taskId, type, crudExposeRef, dialogShow }) {
  return {
    crudOptions: {
      form: {
        labelCol: { span: null, style: { minWidth: '80px' } },
        wrapper: {
          is: 'a-drawer',
          buttons: {
            reset: { show: false },
            cancel: { show: true, text: '关闭' },
            ok: { show: false },
            success: {
              text: '审批通过',
              type: 'primary',
              show: compute(({ row }) => {
                return type === 1;
              }),
              click: ({ form }) => {
                defHttp
                  .put(`/bpm/process_tasks/${taskId}/complete`, form)
                  .then(() => {
                    dialogShow.value = false;
                    // TODO 应该用 ui.notification 同时应该忽略通用的
                    notification.success({ message: '审批成功', duration: 3 });
                    crudExposeRef.value.doRefresh();
                  });
              },
            },
            comment: {
              text: '评论',
              type: 'primary',
              show: compute(({ row }) => {
                return type === 0;
              }),
              click: ({ form }) => {
                defHttp
                  .put(`/bpm/process_tasks/${taskId}/comment`, form)
                  .then(() => {
                    dialogShow.value = false;
                    notification.success({ message: '操作成功', duration: 3 });
                    crudExposeRef.value.doRefresh();
                  });
              },
            },
            cancelTask: {
              text: '审批拒绝',
              type: 'primary',
              danger: true,
              show: compute(({ row }) => {
                return type === 1;
              }),
              click: ({ form }) => {
                defHttp
                  .put(`/bpm/process_tasks/${taskId}/reject`, form)
                  .then(() => {
                    dialogShow.value = false;
                    notification.success({ message: '操作成功', duration: 3 });
                    crudExposeRef.value.doRefresh();
                  });
              },
            },
          },
        },
      },
      columns: {
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
            show: compute(({ row }) => {
              return type === 1;
            }),
            component: {
              sizeLimit: 1024 * 1024 * 5,
              uploader: {
                type: 'form',
              },
              valueType: 'fileId',
              async buildUrl(value: string) {
                return new Promise((resolve) => {
                  // resolve(GetGlobPreviewUrl(value));
                });
              },
            },
            helper: '大小不能超过5M',
          },
        },
      },
    },
  };
}
