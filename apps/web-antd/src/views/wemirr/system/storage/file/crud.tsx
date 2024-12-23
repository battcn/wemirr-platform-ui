import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';

import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';

import { downloadFile } from './api';
import * as api from "#/views/wemirr/wms/inbound/receivingPlan/api";

export default function (props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { showTableComputed, nodeRef } = props.context;
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) => {
          query.category = query.category > 0 ? null : nodeRef?.value?.category;
          return await defHttp.get(`/suite/file-storage/page`, {
            params: query,
          });
        },
        editRequest: async ({ form }: EditReq) => {
          await defHttp.put(
            `/suite/file-storage/rename/${form.id}/${form.originalFilename}`,
          );
        },
        delRequest: async ({ row }: any) =>
          await defHttp.post(`/suite/file-storage/${row.id}`),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {
          add: {
            show: false,
            icon: 'codicon:repo-force-push',
            text: '文件上传',
            async click(context: any) {
              notification.error({
                message: '暂未实现',
                duration: 3,
              });
            },
          },
        },
      },
      table: {
        show: showTableComputed,
      },
      rowHandle: {
        width: 200,
        buttons: {
          add: { show: false },
          view: { show: false },
          edit: {
            show: true,
            text: '重命名',
            title: '重命名',
          },
          download: {
            // icon: "ant-design:cloud-download-outlined",
            type: 'link',
            text: '下载',
            size: 'small',
            title: '文件下载',
            order: 1,
            async click(context: any) {
              notification.info({
                message: '开始下载',
                duration: 3,
              });
              downloadFile(context.row.url, context.row.originalFilename);
            },
          },

          remove: { order: 2 },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        originalFilename: {
          title: '原始名',
          type: 'text',
          column: { ellipsis: true, width: 230 },
          search: { show: true },
        },
        formatSize: {
          title: '文件大小',
          type: 'text',
          form: { show: false },
          column: { ellipsis: true, width: 100 },
        },
        platform: {
          title: '存储平台',
          type: 'text',
          form: { show: false },
          column: { ellipsis: true, width: 150, show: true },
        },
        createdName: {
          title: '上传者',
          type: 'text',
          form: { show: false },
          search: { show: true },

          column: { ellipsis: true, width: 150 },
        },
        url: {
          title: '预览',
          column: { ellipsis: true, width: 150 },
          form: { show: false },
        },
        createdTime: {
          title: '上传时间',
          type: 'datetime',
          form: { show: false },
          column: { ellipsis: true, width: 180 },
          valueBuilder({ value, row, key }: any) {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
    },
  };
}
