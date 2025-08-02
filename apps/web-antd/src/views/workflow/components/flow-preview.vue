<script setup lang="ts">
import { useAppConfig } from '@vben/hooks';
import { useAccessStore } from '@vben/stores';

defineOptions({ name: 'FlowPreview' });

const props = defineProps<{ instanceId: string }>();

const { clientId } = useAppConfig(import.meta.env, import.meta.env.PROD);

const accessStore = useAccessStore();
const params = {
  Authorization: `Bearer ${accessStore.accessToken}`,
  id: props.instanceId,
  clientid: clientId,
  type: 'FlowChart',
};

/**
 * iframe地址
 */
const url = `${import.meta.env.VITE_GLOB_API_URL}/warm-flow-ui/index.html?${JSON.stringify(params)}`;
</script>

<template>
  <iframe :src="url" class="h-[500px] w-full border"></iframe>
</template>
