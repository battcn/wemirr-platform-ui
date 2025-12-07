<script lang="ts" setup>
import { ref, watch } from 'vue';

import { SearchOutlined, ThunderboltOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import * as api from './api';

defineOptions({
  name: 'SemanticSearchModal',
});

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

interface Props {
  visible: boolean;
  knowledgeBase: any | null;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
}

const loading = ref(false);
const searchQuery = ref('');
const topK = ref(5);
const searchResults = ref<api.EmbeddingMatchRep[]>([]);

// 执行语义搜索
const handleSearch = async () => {
  if (!props.knowledgeBase) {
    message.warning('请先选择知识库');
    return;
  }

  if (!searchQuery.value.trim()) {
    message.warning('请输入搜索内容');
    return;
  }

  loading.value = true;
  searchResults.value = [];

  try {
    const results = await api.SemanticSearch(
      props.knowledgeBase.id,
      searchQuery.value.trim(),
      topK.value,
    );
    searchResults.value = results || [];
    if (searchResults.value.length === 0) {
      message.info('未找到匹配的内容');
    }
  } catch (error) {
    console.error('语义搜索失败:', error);
    message.error('语义搜索失败');
  } finally {
    loading.value = false;
  }
};

// 监听弹窗打开
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      searchQuery.value = '';
      searchResults.value = [];
      topK.value = props.knowledgeBase?.topK || 5;
    }
  },
  { immediate: true },
);

// 关闭弹窗
const handleCancel = () => {
  emit('update:visible', false);
};

// 格式化分数显示
const formatScore = (score: number) => {
  return score ? score.toFixed(4) : '-';
};

// 格式化元数据
const formatMetadata = (metadata: Record<string, any>) => {
  if (!metadata || Object.keys(metadata).length === 0) {
    return null;
  }
  return JSON.stringify(metadata, null, 2);
};
</script>

<template>
  <a-modal
    :visible="visible"
    :title="`召回测试${knowledgeBase ? ` - ${knowledgeBase.name}` : ''}`"
    width="1000px"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-spin :spinning="loading">
      <div class="search-container">
        <!-- 搜索区域 -->
        <div class="search-bar">
          <a-input-search
            v-model:value="searchQuery"
            placeholder="请输入搜索内容..."
            size="large"
            allow-clear
            @search="handleSearch"
            @press-enter="handleSearch"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
            <template #enterButton>
              <a-button type="primary" :loading="loading">
                <ThunderboltOutlined />
                搜索
              </a-button>
            </template>
          </a-input-search>
          <div class="search-params">
            <span class="param-label">TopK:</span>
            <a-input-number
              v-model:value="topK"
              :min="1"
              :max="50"
              :precision="0"
              size="small"
              style="width: 80px"
            />
          </div>
        </div>

        <!-- 搜索结果列表 -->
        <div v-if="!loading && searchResults.length > 0" class="results-list">
          <div
            v-for="(result, index) in searchResults"
            :key="index"
            class="result-item"
          >
            <div class="result-header">
              <a-tag color="blue">结果 #{{ index + 1 }}</a-tag>
              <a-tag color="green">
                相似度: {{ formatScore(result.score) }}
              </a-tag>
              <a-tag v-if="result.searchType" color="default">
                {{ result.searchType }}
              </a-tag>
            </div>
            <div class="result-content">
              <pre class="content-text">{{ result.content }}</pre>
            </div>
            <div v-if="formatMetadata(result.metadata)" class="result-metadata">
              <a-collapse>
                <a-collapse-panel key="metadata" header="元数据">
                  <pre class="metadata-text">{{
                    formatMetadata(result.metadata)
                  }}</pre>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!loading" class="empty-state">
          <SearchOutlined class="empty-icon" />
          <p v-if="searchQuery.trim()" class="empty-text">
            未找到匹配的内容，请尝试其他关键词
          </p>
          <p v-else class="empty-text">请输入搜索内容进行召回测试</p>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  min-height: 400px;
  max-height: 70vh;
}

.search-bar {
  margin-bottom: 16px;
}

.search-params {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 12px;
}

.param-label {
  font-size: 14px;
  color: #666;
}

.results-list {
  flex: 1;
  padding-right: 4px;
  overflow-y: auto;
}

.result-item {
  padding: 16px;
  margin-bottom: 16px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  transition: all 0.3s;
}

.result-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.result-header {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.result-content {
  padding: 12px;
  margin-bottom: 8px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.content-text {
  padding: 0;
  margin: 0;
  font-family:
    Monaco, Menlo, 'Ubuntu Mono', Consolas, source-code-pro, monospace;
  font-size: 13px;
  line-height: 1.8;
  color: #333;
  word-wrap: break-word;
  white-space: pre-wrap;
  background: transparent;
  border: none;
}

.result-metadata {
  margin-top: 8px;
}

.metadata-text {
  padding: 0;
  margin: 0;
  font-family:
    Monaco, Menlo, 'Ubuntu Mono', Consolas, source-code-pro, monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #666;
  word-wrap: break-word;
  white-space: pre-wrap;
  background: transparent;
  border: none;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #999;
}

.empty-icon {
  margin-bottom: 16px;
  font-size: 64px;
  color: #d9d9d9;
}

.empty-text {
  margin: 0;
  font-size: 16px;
  color: #999;
}

/* 滚动条样式 */
.results-list::-webkit-scrollbar {
  width: 6px;
}

.results-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.results-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.results-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
