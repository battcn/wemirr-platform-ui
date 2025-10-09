<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useTabs } from '@vben/hooks';
import { useAccessStore } from '@vben/stores';

import { useEventListener } from '@vueuse/core';

const router = useRouter();
const route = useRoute();
const accessStore = useAccessStore();
const timestamp = Date.now();
const iframeUrl = ref(
  `${import.meta.env.VITE_GLOB_API_URL}/workflow/warm-flow-ui/index.html?id=${route.query?.defId}&Authorization=Bearer ${accessStore.accessToken}&_t=${timestamp}`,
);

const iframeLoaded = () => {};
onMounted(() => {
  iframeLoaded();
});

const { closeCurrentTab } = useTabs();

function messageHandler(event: MessageEvent) {
  switch (event.data.method) {
    case 'close': {
      // 关闭当前tab
      closeCurrentTab();
      // 跳转到流程定义列表
      router.push('/workflow/process/model');
      break;
    }
  }
}

// iframe监听组件内设计器保存事件
useEventListener('message', messageHandler);
</script>
<template>
  <div class="wf-container size-full">
    <iframe :src="iframeUrl" class="size-full"></iframe>
  </div>
</template>
<style lang="less" scoped>
.wf-container {
  padding: 8px !important;
}
</style>
