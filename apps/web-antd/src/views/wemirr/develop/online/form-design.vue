<script setup lang="ts">
import type { PageSchema } from 'epic-designer';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import { useUi } from '@fast-crud/fast-crud';
import { EDesigner } from 'epic-designer';

import * as api from './api';

const { ui } = useUi();

const { closeCurrentTab } = useTabs();
const route = useRoute();
const modelId: any = route.query.modelId;
const designerRef = ref<InstanceType<typeof EDesigner>>();
onMounted(async () => {
  await api.getOnlineModelDetail(modelId).then((data) => {
    if (data.formSchemas) {
      designerRef.value?.setData({
        schemas: data.formSchemas,
        script: data.formScript,
      });
    }
  });
});
/**
 * 点击保存按钮操作
 * @param e
 */
function handleSubmit(e: PageSchema) {
  api.saveFormDesign(modelId, e).then(() => {
    closeCurrentTab();
    ui.notification.success('表单设计成功');
  });
}
</script>
<template>
  <Page title="实验功能-表单设计">
    <template #description> 孵化阶段,暂不支持复杂的逻辑交互 </template>
    <EDesigner
      ref="designerRef"
      :disabled-zoom="true"
      :lock-default-schema-edit="true"
      title="表单设计"
      @save="handleSubmit"
    >
      <template #header-prefix>
        <div>WP 设计器</div>
      </template>
    </EDesigner>
  </Page>
</template>

<style scoped lang="less"></style>
