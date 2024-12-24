<script lang="ts" setup>
import { computed } from 'vue';

import {
  CustomerServiceOutlined,
  FileImageOutlined,
  FileOutlined,
  FileUnknownOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons-vue';

defineOptions({ name: 'FileItem' });

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

// 判断是否为图片类型
const isImage = computed(
  () => ['IMAGE'].includes(props.data.category) && props.data.url,
);

// 文件类型与图标组件的映射
const iconMapping = {
  AUDIO: CustomerServiceOutlined,
  VIDEO: PlayCircleOutlined,
  IMAGE: FileImageOutlined,
  DOCUMENT: FileOutlined,
  OTHER: FileUnknownOutlined,
} as any;

// 获取对应的图标组件
const IconComponent = computed(() => {
  const category = props.data.category;
  return iconMapping[category] || FileUnknownOutlined;
});
</script>

<template>
  <div class="file-preview">
    <!-- 如果是图片，则显示图片 -->
    <img v-if="isImage" :src="props.data.url" alt="img" class="file-image" />
    <!-- 如果不是图片，则显示对应的图标 -->
    <component :is="IconComponent" v-else class="file-icon" />
  </div>
</template>

<style scoped>
.file-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  text-align: center;
  padding: 0;
}

.file-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.file-icon {
  font-size: 24px;
  color: #1677ff;
}
</style>
