<script lang="ts">
import { defineAsyncComponent, defineComponent, onMounted, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import createCrudOptions from './crud';

const ToolsModal = defineAsyncComponent(() => import('./ToolsModal.vue'));

export default defineComponent({
  name: 'McpServerConfigPageList',
  components: {
    ToolsModal,
  },
  setup() {
    const crudRef = ref();
    const crudBinding = ref();

    // 工具查看弹窗
    const toolsModalVisible = ref(false);
    const selectedMcpServer = ref<any>(null);

    const openToolsModal = (mcpServer: any) => {
      selectedMcpServer.value = mcpServer;
      toolsModalVisible.value = true;
    };

    onMounted(() => {
      const { crudExpose } = useFs({
        crudBinding,
        crudRef,
        createCrudOptions,
        context: {
          openToolsModal,
        },
      });

      crudExpose.doRefresh();
    });

    return {
      crudBinding,
      crudRef,
      toolsModalVisible,
      selectedMcpServer,
    };
  },
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud v-if="crudBinding" ref="crudRef" v-bind="crudBinding" />

    <ToolsModal
      :visible="toolsModalVisible"
      @update:visible="toolsModalVisible = $event"
      :mcp-server="selectedMcpServer"
    />
  </fs-page>
</template>
