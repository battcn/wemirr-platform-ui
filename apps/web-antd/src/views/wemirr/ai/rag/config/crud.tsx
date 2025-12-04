import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
} from '@fast-crud/fast-crud';

import { ref } from 'vue';

import { dict } from '@fast-crud/fast-crud';
import { message } from 'ant-design-vue';

import * as api from './api';

export default function crud({
  crudExpose,
}: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const chatModels = ref<any[]>([]);
  const embeddingModels = ref<any[]>([]);

  // 创建字典配置
  const chatModelDict = dict({
    data: [],
  });

  const embeddingModelDict = dict({
    data: [],
  });

  // 加载聊天模型和嵌入模型数据
  const loadModels = async () => {
    try {
      const [chatModelsRes, embeddingModelsRes] = await Promise.all([
        api.GetChatModels(),
        api.GetEmbeddingModels(),
      ]);

      chatModels.value =
        (chatModelsRes as any).records?.map((item: any) => ({
          value: item.id,
          label: `${item.provider} - ${item.modelName}`,
        })) || [];

      embeddingModels.value =
        (embeddingModelsRes as any).records?.map((item: any) => ({
          value: item.id,
          label: `${item.provider} - ${item.modelName}`,
        })) || [];

      // 更新字典数据
      chatModelDict.setData(chatModels.value);
      embeddingModelDict.setData(embeddingModels.value);
    } catch (error) {
      console.error('加载模型数据失败:', error);
      message.error('加载模型数据失败');
    }
  };

  // 初始化时加载模型数据
  loadModels();
  return {
    crudOptions: {
      afterCrudCreated: () => {
        // 在CRUD创建后重新加载模型数据
        loadModels();
      },
      request: {
        pageRequest: async (query: any) => {
          return await api.PageList(query);
        },
        addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        editRequest: async ({ form }: EditReq) =>
          await api.UpdateObj(form.id, form),
        delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
      },
      toolbar: {
        buttons: {
          add: {
            show: true,
          },
        },
      },
      search: {
        show: true,
        columns: {
          name: {
            title: '知识库名称',
            type: 'text',
            search: { show: true },
          },
          description: {
            title: '描述',
            type: 'text',
            search: { show: true },
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
        name: {
          title: '知识库名称',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 200 },
        },
        description: {
          title: '描述',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 250 },
        },
        topK: {
          title: '相似结果数量',
          type: 'number',
          column: { width: 120 },
        },
        minScore: {
          title: '相似度阈值',
          type: 'number',
          column: { width: 120 },
          formatter: ({ value }: any) => {
            return value ? value.toFixed(2) : '-';
          },
        },
        ingestMaxOverlap: {
          title: '切割重叠数量',
          type: 'number',
          form: {
            col: { span: 12 },
            helper: '文档切割时重叠数量(根据token计算)',
          },
        },
        ingestMaxLength: {
          title: '切割最大长度',
          type: 'number',
          form: {
            col: { span: 12 },
            helper: '文档切割时最大长度(根据token计算)',
          },
        },
        retrieveMaxResults: {
          title: '召回最大数量',
          type: 'number',
          form: {
            col: { span: 12 },
            helper: '文档召回最大数量',
          },
        },
        chatModelId: {
          title: '聊天模型',
          type: 'dict-select',
          column: { width: 180 },
          dict: chatModelDict,
        },
        embeddingModelId: {
          title: '向量模型',
          type: 'dict-select',
          column: { width: 180 },
          dict: embeddingModelDict,
          editForm: { show: false },
        },
      },
      rowHandle: {
        fixed: 'right',
        width: 280,
        buttons: {
          edit: {
            show: true,
          },
          remove: {
            show: true,
          },
          custom: {
            text: '文档管理',
            type: 'link',
            size: 'small',
            click: ({ row }: any) => {
              // TODO: 跳转到文档管理页面
              message.info(`跳转到知识库"${row.name}"的文档管理页面`);
            },
            order: 10,
          },
          // upload: {
          //   text: '上传文档',
          //   type: 'primary',
          //   size: 'small',
          //   click: ({ row }: any) => {
          //     // TODO: 打开文档上传对话框
          //     message.info(`为知识库"${row.name}"上传文档`);
          //   },
          // },
        },
      },
    },
  };
}
