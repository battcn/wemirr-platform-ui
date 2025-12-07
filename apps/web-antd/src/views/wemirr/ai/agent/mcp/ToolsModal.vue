<script lang="ts" setup>
import type { McpToolInfo } from './api';

import { onMounted, ref, watch } from 'vue';

import { message } from 'ant-design-vue';

import * as api from './api';

interface Props {
  visible: boolean;
  mcpServer: any;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>();

const loading = ref(false);
const tools = ref<McpToolInfo[]>([]);

const columns = [
  {
    title: '工具名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '工具描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
];

const loadTools = async () => {
  if (!props.mcpServer?.id) return;

  loading.value = true;
  try {
    const result = await api.GetTools(props.mcpServer.id);
    tools.value = result || [];
  } catch (error: any) {
    message.error(`获取工具列表失败: ${error.message}`);
    tools.value = [];
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      loadTools();
    }
  },
);

onMounted(() => {
  if (props.visible) {
    loadTools();
  }
});

const handleClose = () => {
  emit('update:visible', false);
};
</script>

<template>
  <a-modal
    :open="visible"
    :title="`MCP工具列表 - ${mcpServer?.name || ''}`"
    width="800px"
    :footer="null"
    @cancel="handleClose"
  >
    <a-alert
      v-if="!loading && tools.length === 0"
      message="暂无可用工具"
      type="info"
      show-icon
      style="margin-bottom: 16px"
    />

    <a-table
      :columns="columns"
      :data-source="tools"
      :loading="loading"
      :pagination="false"
      row-key="name"
      size="middle"
      :scroll="{ y: 400 }"
    >
      <template #emptyText>
        <a-empty description="暂无工具数据" />
      </template>
    </a-table>

    <template #footer>
      <a-button type="primary" @click="handleClose">关闭</a-button>
    </template>
  </a-modal>
</template>
