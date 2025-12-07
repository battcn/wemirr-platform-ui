<script lang="ts" setup>
import { ref } from 'vue';

import { UploadOutlined } from '@ant-design/icons-vue';
import { message, Upload } from 'ant-design-vue';

import * as api from '../api';

interface Props {
  modelValue?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const uploading = ref(false);
const imageUrl = ref(props.modelValue);

// 上传前检查
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('请上传图片文件！');
    return false;
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过2MB！');
    return false;
  }

  return true;
};

// 自定义上传
const customRequest = async (options: any) => {
  const { file, onSuccess, onError, onProgress } = options;

  uploading.value = true;

  try {
    // 模拟上传进度
    onProgress({ percent: 30 });

    const result = await api.uploadAvatar(file);

    onProgress({ percent: 100 });
    imageUrl.value = result;
    emit('update:modelValue', result);
    onSuccess(result);
    message.success('头像上传成功');
  } catch (error) {
    onError(error);
    message.error('头像上传失败');
  } finally {
    uploading.value = false;
  }
};

// 获取图片URL用于预览
const getImageUrl = () => {
  return imageUrl.value || props.modelValue;
};
</script>

<template>
  <div class="avatar-upload">
    <Upload
      :custom-request="customRequest"
      :before-upload="beforeUpload"
      :show-upload-list="false"
      accept="image/*"
    >
      <div class="upload-trigger">
        <img
          v-if="getImageUrl()"
          :src="getImageUrl()"
          alt="头像"
          class="avatar-image"
        />
        <div v-else class="upload-placeholder">
          <UploadOutlined />
          <div class="upload-text">上传头像</div>
        </div>

        <div v-if="uploading" class="upload-loading">
          <a-spin size="small" />
        </div>
      </div>
    </Upload>
  </div>
</template>

<style lang="less" scoped>
.avatar-upload {
  .upload-trigger {
    position: relative;
    display: inline-block;
    width: 80px;
    height: 80px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.3s;

    &:hover {
      border-color: #1890ff;
    }
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999;

    .upload-text {
      margin-top: 4px;
      font-size: 12px;
    }
  }

  .upload-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 6px;
  }
}
</style>
