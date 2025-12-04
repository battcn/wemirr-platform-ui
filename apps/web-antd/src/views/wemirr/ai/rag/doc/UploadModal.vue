<script lang="ts" setup>
import { computed, ref } from 'vue';

import {
  DeleteOutlined,
  FileOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import * as documentApi from './api';

defineOptions({
  name: 'UploadModal',
});

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

interface Props {
  visible: boolean;
  knowledgeBase: any;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'success'): void;
}

const uploading = ref(false);
const fileList = ref<File[]>([]);
const dragOver = ref(false);

// 支持的文件类型
const supportedTypes = new Set([
  'application/msword',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/markdown',
  'text/plain',
]);

const supportedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.md'];

// 计算上传进度
const uploadProgress = computed(() => {
  return fileList.value.length > 0
    ? (fileList.value.filter((f) => (f as any).uploaded).length /
        fileList.value.length) *
        100
    : 0;
});

// 文件验证
const validateFile = (file: File): null | string => {
  if (!supportedTypes.has(file.type)) {
    return `不支持的文件类型: ${file.name}。只支持 PDF、Word、TXT、Markdown 格式`;
  }

  if (file.size > 50 * 1024 * 1024) {
    return `文件过大: ${file.name}。文件大小不能超过 50MB`;
  }

  return null;
};

// 处理文件选择
const handleFileSelect = (files: File[] | FileList) => {
  const newFiles: File[] = [];

  for (const file of files) {
    const error = validateFile(file);

    if (error) {
      message.error(error);
      continue;
    }

    // 检查是否已存在
    if (
      !fileList.value.find((f) => f.name === file.name && f.size === file.size)
    ) {
      (file as any).uploaded = false;
      newFiles.push(file);
    }
  }

  fileList.value = [...fileList.value, ...newFiles];
};

// 拖拽事件处理
const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  dragOver.value = true;
};

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  dragOver.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  dragOver.value = false;

  const files = e.dataTransfer?.files;
  if (files) {
    handleFileSelect(files);
  }
};

// 点击上传
const handleClickUpload = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = supportedExtensions.join(',');
  input.addEventListener('change', (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      handleFileSelect(files);
    }
  });
  input.click();
};

// 移除文件
const removeFile = (index: number) => {
  fileList.value.splice(index, 1);
};

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

// 开始上传
const startUpload = async () => {
  if (!props.knowledgeBase) {
    message.error('请先选择知识库');
    return;
  }

  if (fileList.value.length === 0) {
    message.error('请选择要上传的文件');
    return;
  }

  uploading.value = true;
  let successCount = 0;
  let failCount = 0;

  try {
    for (const file of fileList.value) {
      if ((file as any).uploaded) continue;

      try {
        await documentApi.UploadDocument(props.knowledgeBase.id, file);
        (file as any).uploaded = true;
        successCount++;
      } catch (error) {
        console.error(`上传失败: ${file.name}`, error);
        failCount++;
      }
    }

    if (successCount > 0) {
      message.success(`成功上传 ${successCount} 个文件`);
      emit('success');
    }

    if (failCount > 0) {
      message.error(`${failCount} 个文件上传失败`);
    }

    if (successCount > 0 && failCount === 0) {
      handleCancel();
    }
  } finally {
    uploading.value = false;
  }
};

// 取消/关闭
const handleCancel = () => {
  fileList.value = [];
  dragOver.value = false;
  uploading.value = false;
  emit('update:visible', false);
};
</script>

<template>
  <a-modal
    :visible="visible"
    title="上传文档"
    width="600px"
    :confirm-loading="uploading"
    @ok="startUpload"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button
        type="primary"
        :loading="uploading"
        :disabled="fileList.length === 0"
        @click="startUpload"
      >
        开始上传 ({{ fileList.length }})
      </a-button>
    </template>

    <div class="upload-container">
      <!-- 知识库信息 -->
      <div v-if="knowledgeBase" class="kb-info">
        <a-alert
          :message="`将上传到知识库: ${knowledgeBase.name}`"
          type="info"
          show-icon
          class="mb-4"
        />
      </div>

      <!-- 拖拽上传区域 -->
      <div
        class="drag-upload-area"
        :class="{ 'drag-over': dragOver, 'has-files': fileList.length > 0 }"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        @click="handleClickUpload"
      >
        <div class="upload-icon">
          <UploadOutlined class="text-4xl text-blue-500" />
        </div>
        <div class="upload-text">
          <p class="primary-text">点击或拖拽文件到此区域上传</p>
          <p class="secondary-text">
            支持 PDF、Word、TXT、Markdown 格式，单个文件不超过 50MB
          </p>
        </div>
      </div>

      <!-- 文件列表 -->
      <div v-if="fileList.length > 0" class="file-list">
        <div class="file-list-header">
          <span>文件列表 ({{ fileList.length }})</span>
          <a-button size="small" @click="fileList = []">清空</a-button>
        </div>

        <div class="file-items">
          <div
            v-for="(file, index) in fileList"
            :key="`${file.name}-${index}`"
            class="file-item"
            :class="{ uploaded: (file as any).uploaded }"
          >
            <div class="file-info">
              <FileOutlined class="file-icon" />
              <div class="file-details">
                <div class="file-name" :title="file.name">{{ file.name }}</div>
                <div class="file-size">{{ formatFileSize(file.size) }}</div>
              </div>
            </div>

            <div class="file-status">
              <a-tag v-if="(file as any).uploaded" color="success">
                已上传
              </a-tag>
              <a-tag v-else color="default">待上传</a-tag>
              <a-button
                size="small"
                type="text"
                danger
                :disabled="uploading"
                @click="removeFile(index)"
              >
                <DeleteOutlined />
              </a-button>
            </div>
          </div>
        </div>

        <!-- 上传进度 -->
        <div v-if="uploading" class="upload-progress">
          <a-progress
            :percent="Math.round(uploadProgress)"
            :show-info="true"
            status="active"
          />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
.upload-container {
  padding: 16px 0;
}

.drag-upload-area {
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  background: #fafafa;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  transition: all 0.3s;
}

.drag-upload-area:hover {
  background: #f0f9ff;
  border-color: #1890ff;
}

.drag-upload-area.drag-over {
  background: #e6f7ff;
  border-color: #1890ff;
  transform: scale(1.02);
}

.drag-upload-area.has-files {
  padding: 20px;
}

.upload-icon {
  margin-bottom: 16px;
}

.primary-text {
  margin-bottom: 8px;
  font-size: 16px;
  color: #333;
}

.secondary-text {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.file-list {
  margin-top: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
}

.file-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  font-weight: 500;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

.file-items {
  max-height: 300px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s;
}

.file-item:last-child {
  border-bottom: none;
}

.file-item:hover {
  background: #f9f9f9;
}

.file-item.uploaded {
  background: #f6ffed;
}

.file-info {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
}

.file-icon {
  margin-right: 12px;
  font-size: 16px;
  color: #1890ff;
}

.file-details {
  flex: 1;
  min-width: 0;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.file-size {
  margin-top: 2px;
  font-size: 12px;
  color: #999;
}

.file-status {
  display: flex;
  gap: 8px;
  align-items: center;
}

.upload-progress {
  padding: 16px;
  background: #f9f9f9;
}
</style>
