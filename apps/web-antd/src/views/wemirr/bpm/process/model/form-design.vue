<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';

import { EDesigner, type PageSchema } from 'epic-designer';

import * as api from './api';

const route = useRoute();
const modelId: any = route.query.modelId;
const designerRef = ref<InstanceType<typeof EDesigner>>();
onMounted(async () => {
  api.getFormByModelId(modelId).then((data) => {
    designerRef.value?.setData(data);
  });
});
/**
 * 点击保存按钮操作
 * @param e
 */
function handleSubmit(e: PageSchema) {
  api.saveFormDesign(modelId, e);
}
</script>
<template>
  <Page content-class="flex flex-row gap-2 designer-container">
    <EDesigner
      ref="designerRef"
      :disabled-zoom="true"
      :lock-default-schema-edit="true"
      title=""
      @save="handleSubmit"
    >
      <template #header-prefix>
        <div>WP 设计器</div>
      </template>
    </EDesigner>
  </Page>
</template>
