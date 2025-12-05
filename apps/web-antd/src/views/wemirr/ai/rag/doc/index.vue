<script lang="ts" setup name="RagDocumentManage">
import {
  computed,
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';

import {
  BookOutlined,
  DatabaseOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue';
import { useFs } from '@fast-crud/fast-crud';
import { Card, message } from 'ant-design-vue';

import * as knowledgeBaseApi from '../config/api';
import * as documentApi from './api';
import createCrudOptions from './crud';

const UploadModal = defineAsyncComponent(() => import('./UploadModal.vue'));
const PreviewModal = defineAsyncComponent(() => import('./PreviewModal.vue'));
const PreviewChunkModal = defineAsyncComponent(
  () => import('./PreviewChunkModal.vue'),
);

// 知识库数据
const knowledgeBaseData = ref<any[]>([]);
const selectedKnowledgeBase = ref<any>(null);
const selectedKeys = ref<number[]>([]);
const loading = ref(false);
const searchText = ref('');
const uploadModalVisible = ref(false);
const previewModalVisible = ref(false);
const previewChunkModalVisible = ref(false);
const previewDocumentId = ref<number | null>(null);
const previewDocumentTitle = ref<string>('');

// 轮询状态管理
const pollingMap = ref<Map<number, ReturnType<typeof setTimeout>>>(new Map());
const pollingDocuments = ref<Set<number>>(new Set());

// 过滤后的知识库列表
const filteredKnowledgeBases = computed(() => {
  if (!searchText.value.trim()) {
    return knowledgeBaseData.value;
  }
  const keyword = searchText.value.toLowerCase().trim();
  return knowledgeBaseData.value.filter(
    (kb) =>
      kb.name.toLowerCase().includes(keyword) ||
      (kb.description && kb.description.toLowerCase().includes(keyword)),
  );
});

// 开始轮询向量化状态
const startVectorizeStatusPolling = (documentId: number) => {
  // 如果已经在轮询中，先清除
  if (pollingMap.value.has(documentId)) {
    clearTimeout(pollingMap.value.get(documentId)!);
  }

  pollingDocuments.value.add(documentId);

  const poll = async () => {
    try {
      const status = await documentApi.GetVectorizeStatus(documentId);

      // 如果状态已完成（成功或失败），停止轮询并刷新列表
      if (status.vectorized === 1 || status.vectorized === -1) {
        pollingDocuments.value.delete(documentId);
        pollingMap.value.delete(documentId);

        // 刷新列表
        crudExpose.doRefresh();

        // 显示结果消息
        if (status.vectorized === 1) {
          message.success('文档向量化完成');
        } else {
          message.error(
            `文档向量化失败${status.message ? `: ${status.message}` : ''}`,
          );
        }

        return;
      }

      // 如果仍在处理中，继续轮询
      if (status.vectorized === 2) {
        const timer = setTimeout(poll, 10_000); // 10秒后再次查询
        pollingMap.value.set(documentId, timer);
      }
    } catch (error) {
      console.error('查询向量化状态失败:', error);
      // 出错时也停止轮询
      pollingDocuments.value.delete(documentId);
      pollingMap.value.delete(documentId);
    }
  };

  // 立即执行一次查询
  poll();
};

// 停止所有轮询
const stopAllPolling = () => {
  pollingMap.value.forEach((timer) => {
    clearTimeout(timer);
  });
  pollingMap.value.clear();
  pollingDocuments.value.clear();
};

// 打开预览弹窗
const openPreviewModal = (documentId: number, documentTitle?: string) => {
  previewDocumentId.value = documentId;
  previewDocumentTitle.value = documentTitle || '';
  previewModalVisible.value = true;
};

// 打开分块预览弹窗
const openPreviewChunkModal = (documentId: number, documentTitle?: string) => {
  previewDocumentId.value = documentId;
  previewDocumentTitle.value = documentTitle || '';
  previewChunkModalVisible.value = true;
};

// 初始化fast-crud
const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: {
    selectedKnowledgeBase,
    uploadDocument: async (file: File) => {
      if (!selectedKnowledgeBase.value) {
        throw new Error('请先选择知识库');
      }
      await documentApi.UploadDocument(selectedKnowledgeBase.value.id, file);
    },
    vectorizeDocument: async (documentId: number) => {
      await documentApi.VectorizeDocument(documentId);
    },
    startVectorizeStatusPolling,
    openPreviewModal,
    openPreviewChunkModal,
  },
});

// 获取知识库列表
const getKnowledgeBases = async () => {
  loading.value = true;
  try {
    const params = {
      current: 1,
      size: 1000,
    };
    const res = await knowledgeBaseApi.PageList(params);
    knowledgeBaseData.value = (res as any).records || [];
  } catch {
    message.error('获取知识库列表失败');
  } finally {
    loading.value = false;
  }
};

// 选择知识库 - 参考文件管理的handleSelect
const handleSelectKnowledgeBase = (kb: any) => {
  selectedKnowledgeBase.value = kb;
  selectedKeys.value = [kb.id];
  // 停止之前的轮询
  stopAllPolling();
  // 刷新文档列表
  crudExpose.doRefresh();
};

// 搜索知识库
const handleSearch = () => {
  // 搜索是通过computed自动触发的，这里可以添加其他逻辑
  console.log('搜索关键词:', searchText.value);
};

// 清空搜索
const handleClearSearch = () => {
  searchText.value = '';
};

// 打开上传弹窗
const openUploadModal = () => {
  if (!selectedKnowledgeBase.value) {
    message.warning('请先选择知识库');
    return;
  }
  uploadModalVisible.value = true;
};

// 上传成功回调
const handleUploadSuccess = () => {
  uploadModalVisible.value = false;
  crudExpose.doRefresh();
  message.success('文档上传成功');
};

// 页面初始化
onMounted(async () => {
  await getKnowledgeBases();
  // 默认选择第一个知识库
  if (knowledgeBaseData.value.length > 0) {
    handleSelectKnowledgeBase(knowledgeBaseData.value[0]);
  }
});

// 页面卸载时清理轮询
onUnmounted(() => {
  stopAllPolling();
});
</script>

<template>
  <div>
    <div class="flex gap-2" style="height: calc(100vh - 40px); padding: 20px">
      <!-- 左侧知识库列表 -->
      <Card :bordered="false" class="w-1/4">
        <template #title>
          <div class="flex items-center">
            <DatabaseOutlined class="mr-2 text-blue-500" />
            知识库列表
          </div>
        </template>

        <!-- 搜索框 -->
        <div class="mb-4">
          <a-input-search
            v-model="searchText"
            placeholder="搜索知识库..."
            allow-clear
            @search="handleSearch"
            @clear="handleClearSearch"
          />
        </div>

        <!-- 知识库列表 -->
        <div class="knowledge-base-list">
          <a-spin :spinning="loading">
            <div
              v-for="kb in filteredKnowledgeBases"
              :key="kb.id"
              class="knowledge-base-item"
              :class="{ selected: selectedKeys.includes(kb.id) }"
              @click="handleSelectKnowledgeBase(kb)"
            >
              <div class="kb-header">
                <BookOutlined class="mr-2 text-blue-500" />
                <span class="font-medium">{{ kb.name }}</span>
              </div>
              <div v-if="kb.description" class="kb-description">
                {{ kb.description }}
              </div>
              <div class="kb-meta">
                <a-tag size="small" color="blue">
                  相似度: {{ kb.topK || 5 }}
                </a-tag>
                <a-tag size="small" color="green">
                  最小分数: {{ kb.minScore || 0.7 }}
                </a-tag>
              </div>
              <div class="kb-time">创建时间: {{ kb.createdTime }}</div>
            </div>

            <div
              v-if="filteredKnowledgeBases.length === 0 && !loading"
              class="empty-state"
            >
              <DatabaseOutlined class="mb-4 text-5xl text-gray-300" />
              <p v-if="searchText.trim()" class="text-gray-500">
                未找到包含"{{ searchText }}"的知识库
              </p>
              <div v-else class="text-gray-500">
                <p>暂无知识库</p>
                <p>请先创建知识库</p>
              </div>
            </div>
          </a-spin>
        </div>
      </Card>

      <!-- 右侧文档管理 -->
      <Card class="page-card w-full">
        <template #title>
          <div v-if="selectedKnowledgeBase" class="flex items-center">
            <BookOutlined class="mr-2 text-blue-500" />
            {{ selectedKnowledgeBase.name }} - 文档管理
          </div>
          <div v-else>请选择知识库</div>
        </template>
        <div class="flex-grow" style="min-height: 0">
          <fs-crud ref="crudRef" v-bind="crudBinding" style="height: 100%">
            <template #actionbar-left>
              <a-button
                v-if="selectedKnowledgeBase"
                type="primary"
                @click="openUploadModal"
              >
                <UploadOutlined />
                上传文档
              </a-button>
            </template>
          </fs-crud>
        </div>
      </Card>
    </div>

    <!-- 上传文档弹窗 -->
    <UploadModal
      :visible="uploadModalVisible"
      @update:visible="uploadModalVisible = $event"
      :knowledge-base="selectedKnowledgeBase"
      @success="handleUploadSuccess"
    />

    <!-- 文档预览弹窗 -->
    <PreviewModal
      :visible="previewModalVisible"
      @update:visible="previewModalVisible = $event"
      :document-id="previewDocumentId"
      :document-title="previewDocumentTitle"
    />

    <!-- 文档分块预览弹窗 -->
    <PreviewChunkModal
      :visible="previewChunkModalVisible"
      @update:visible="previewChunkModalVisible = $event"
      :document-id="previewDocumentId"
      :document-title="previewDocumentTitle"
    />
  </div>
</template>

<style lang="less" scoped>
/deep/.page-card {
  .fs-crud-container {
    height: calc(100vh - 150px) !important;
  }

  .ant-card-body {
    padding: 8px;
  }
}

.page-container {
  height: 100vh;
  // background: #f0f2f5;
}

.knowledge-base-list {
  height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 4px;
}

.knowledge-base-item {
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  background: #fff;
}

.knowledge-base-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.knowledge-base-item.selected {
  border-color: #1890ff;
  background: #e6f7ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.kb-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.kb-description {
  color: #666;
  font-size: 12px;
  margin-bottom: 8px;
  line-height: 1.4;
}

.kb-meta {
  margin-bottom: 6px;
}

.kb-time {
  color: #999;
  font-size: 11px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}
</style>
