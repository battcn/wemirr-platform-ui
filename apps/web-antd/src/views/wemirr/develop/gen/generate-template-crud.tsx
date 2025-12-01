// import { downloadByData } from '@/utils/file/download';
import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';

import dayjs from 'dayjs';

import * as api from './generate-template-api';

export default function (props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { showEditModal, showViewModal } = props.context;

  const pageRequest = async (query: any) => await api.pageObj(query);

  const editRequest = async ({ form }: any) => await api.editObj(form);
  const delRequest = async ({ row }: any) => await api.delObj(row);
  const addRequest = async ({ form }: any) => await api.createObj(form);
  return {
    crudOptions: {
      request: {
        pageRequest,
        editRequest,
        delRequest,
        addRequest,
      },
      table: {
        scroll: { fixed: true },
      },
      actionbar: {
        buttons: {
          add: {
            show: false,
          },
        },
      },
      rowHandle: {
        width: 260,
        fixed: 'right',
        buttons: {
          view: {
            async click(context) {
              showViewModal(context.row.id);
            },
          },
          edit: {
            async click(context) {
              showEditModal(context.row.id);
              console.log('点击编辑', context);
            },
          },
          // download: {
          //   // icon: "ant-design:cloud-download-outlined",
          //   type: 'link',
          //   text: '代码生成',
          //   size: 'small',
          //   title: '代码生成',
          //   async click(context) {
          //     await defHttp
          //       .request(`/suite/generate-table/${context.row.id}/generate`, {
          //         method: 'POST',
          //         responseType: 'blob',
          //       })
          //       .then((res) => {
          //         // downloadByData(res, `${context.row.moduleName}.zip`);
          //       });
          //   },
          // },
          // preview: {
          //   // icon: "ant-design:cloud-download-outlined",
          //   type: 'link',
          //   text: '代码预览',
          //   size: 'small',
          //   title: '代码预览',
          //   async click(context) {
          //     await defHttp
          //       .request(`/suite/generate-table/${context.row.id}/preview`, {
          //         method: 'GET',
          //       })
          //       .then((res) => {
          //         showModalPre(context.row.id)
          //         // downloadByData(res, `${context.row.moduleName}.zip`);
          //         console.log('预览结果',res)
          //       });
          //   },
          // },
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
        name: {
          title: '模板名称',
          type: 'text',
          column: { width: 160, ellipsis: true },
          search: { show: true },
        },
        generatePath: {
          title: '模板路径',
          type: 'text',
          column: { width: 160, ellipsis: true },
        },
        description: {
          title: '模板描述',
          type: 'text',
          column: { width: 160, ellipsis: true },
        },
        createName: {
          title: '创建人',
          type: 'text',
          column: { width: 160, ellipsis: true },
        },
        createTime: {
          title: '创建时间',
          type: 'datetime',
          column: { width: 180 },
          form: { show: false },
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
