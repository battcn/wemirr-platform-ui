<script lang="ts">
import { defineAsyncComponent, defineComponent, onMounted, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import createCrudOptions from './crud';

const SemanticSearchModal = defineAsyncComponent(
  () => import('./SemanticSearchModal.vue'),
);

export default defineComponent({
  name: 'KnowledgeBasePageList',
  components: {
    SemanticSearchModal,
  },
  setup() {
    const crudRef = ref();
    // crud 配置的ref
    const crudBinding = ref();
    // 召回测试弹窗
    const semanticSearchModalVisible = ref(false);
    const selectedKnowledgeBase = ref<any>(null);

    const openSemanticSearchModal = (knowledgeBase: any) => {
      selectedKnowledgeBase.value = knowledgeBase;
      semanticSearchModalVisible.value = true;
    };

    onMounted(() => {
      const { crudExpose } = useFs({
        crudBinding,
        crudRef,
        createCrudOptions,
        context: {
          openSemanticSearchModal,
        },
      });

      crudExpose.doRefresh();
    });

    return {
      crudBinding,
      crudRef,
      semanticSearchModalVisible,
      selectedKnowledgeBase,
    };
  },
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud v-if="crudBinding" ref="crudRef" v-bind="crudBinding" />

    <SemanticSearchModal
      :visible="semanticSearchModalVisible"
      @update:visible="semanticSearchModalVisible = $event"
      :knowledge-base="selectedKnowledgeBase"
    />
  </fs-page>
</template>
