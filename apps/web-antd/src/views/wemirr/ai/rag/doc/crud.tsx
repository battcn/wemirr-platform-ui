import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  EditReq,
} from '@fast-crud/fast-crud';

import { h } from 'vue';

import {
  EyeOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons-vue';
import { dict } from '@fast-crud/fast-crud';
import { message } from 'ant-design-vue';

import * as api from './api';

export default function crud(
  props: CreateCrudOptionsProps,
): CreateCrudOptionsRet {
  const {
    selectedKnowledgeBase,
    vectorizeDocument,
    startVectorizeStatusPolling,
    openPreviewModal,
    openPreviewChunkModal,
  } = props.context;

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  // 向量化状态字典
  const vectorizeStatusDict = dict({
    data: [
      { value: 'PENDING', label: '未向量化', color: 'default' },
      { value: 'PROCESSED', label: '已向量化', color: 'success' },
      { value: 'PROCESSING', label: '向量化中', color: 'processing' },
      { value: 'PROCESSED', label: '向量化失败', color: 'error' },
    ],
  });

  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) => {
          // 如果没有选中知识库，返回空结果
          if (!selectedKnowledgeBase.value) {
            return { records: [], total: 0 };
          }
          // 使用选中的知识库ID查询文档
          return await api.PageList({
            ...query,
            knowledgeBaseId: selectedKnowledgeBase.value.id,
          });
        },
        editRequest: async ({ form }: EditReq) =>
          await api.UpdateObj(form.id, form),
        delRequest: async ({ row }: any) => await api.DelObj(row.id),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {},
      },
      search: {
        show: true,
        columns: {
          title: {
            title: '文档名称',
            type: 'text',
            search: { show: true },
          },
          contentType: {
            title: '文件类型',
            type: 'text',
            search: { show: true },
          },
          status: {
            title: '向量化状态',
            type: 'dict-select',
            search: { show: true },
            dict: vectorizeStatusDict,
          },
        },
      },
      rowHandle: {
        width: 300,
        buttons: {
          edit: {
            show: true,
            text: '编辑',
            title: '编辑文档',
          },
          remove: {
            show: true,
            text: '删除',
            title: '删除文档',
          },
          preview: {
            type: 'link',
            text: '预览',
            size: 'small',
            icon: h(EyeOutlined),
            title: '预览文档完整内容',
            show: true,
            click(context: any) {
              if (openPreviewModal) {
                openPreviewModal(context.row.id, context.row.title);
              }
            },
          },
          previewChunk: {
            type: 'link',
            text: '分块',
            size: 'small',
            icon: h(FileTextOutlined),
            title: '预览文档分块内容',
            show: true,
            click(context: any) {
              if (openPreviewChunkModal) {
                openPreviewChunkModal(context.row.id, context.row.title);
              }
            },
          },
          vectorize: {
            type: 'link',
            text: '向量化',
            size: 'small',
            icon: h(ThunderboltOutlined),
            title: '提交向量化任务',
            show: true,
            async click(context: any) {
              // 只对未向量化和向量化失败的文档显示按钮
              if (context.row.vectorized) {
                message.error('文档已向量化，不可重复向量化');
                return;
              }
              try {
                await vectorizeDocument(context.row.id);
                message.success('向量化任务已提交，正在处理中...');

                // 开始轮询状态
                if (startVectorizeStatusPolling) {
                  startVectorizeStatusPolling(context.row.id);
                }

                // 立即刷新列表以显示"向量化中"状态
                if (props.crudExpose?.doRefresh) {
                  await props.crudExpose.doRefresh();
                }
              } catch (error) {
                console.error('向量化任务提交失败:', error);
                message.error('向量化任务提交失败');
              }
            },
          },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        title: {
          title: '文档名称',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 200 },
        },
        fileSize: {
          title: '文件大小',
          type: 'text',
          form: { show: false },
          column: {
            width: 120,
            formatter: ({ value }) => formatFileSize(value),
          },
        },
        contentType: {
          title: '文件类型',
          type: 'text',
          search: { show: true },
          column: { width: 100 },
        },
        status: {
          title: '向量化状态',
          type: 'dict-select',
          search: { show: true },
          column: { width: 120 },
          dict: vectorizeStatusDict,
        },
        brief: {
          title: '内容摘要',
          type: 'textarea',
          column: { show: false },
        }
       
      },
    },
  };
}
