<script lang="ts" setup>
import { ref, watch } from 'vue';

import { FileTextOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import * as documentApi from './api';

defineOptions({
  name: 'PreviewModal',
});

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

interface Props {
  visible: boolean;
  documentId: number | null;
  documentTitle?: string;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
}

const loading = ref(false);
const content = ref('');

// 获取文档预览内容
const fetchPreview = async () => {
  if (!props.documentId) {
    return;
  }

  loading.value = true;
  content.value = '';

  try {
    const result = await documentApi.PreviewDocument(props.documentId);
    content.value = result || '暂无内容';
  } catch (error) {
    console.error('获取文档预览失败:', error);
    message.error('获取文档预览失败');
    content.value = '加载失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

// 监听弹窗打开
watch(
  () => props.visible,
  (newVal) => {
    if (newVal && props.documentId) {
      fetchPreview();
    } else {
      content.value = '';
    }
  },
  { immediate: true },
);

// 关闭弹窗
const handleCancel = () => {
  emit('update:visible', false);
};
</script>

<template>
  <a-modal
    :visible="visible"
    :title="`文档预览${documentTitle ? ` - ${documentTitle}` : ''}`"
    width="900px"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-spin :spinning="loading">
      <div class="preview-container">
        <div v-if="!loading && content" class="preview-content">
          <pre class="content-text">{{ content }}</pre>
        </div>
        <div v-else-if="!loading && !content" class="empty-state">
          <FileTextOutlined class="empty-icon" />
          <p class="empty-text">暂无内容</p>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<style scoped>
.preview-container {
  min-height: 400px;
  max-height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.content-text {
  margin: 0;
  padding: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro',
    monospace;
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
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
  font-size: 64px;
  margin-bottom: 16px;
  color: #d9d9d9;
}

.empty-text {
  margin: 0;
  font-size: 16px;
  color: #999;
}
</style>

