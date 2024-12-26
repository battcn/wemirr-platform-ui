<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useFs } from '@fast-crud/fast-crud';

import DiagramPreview from '#/views/wemirr/bpm/task/complete/DiagramPreview.vue';

import * as api from './api';
import createCrudOptions from './crud';

const bpmnPreviewTitle = ref('');
const processXmlRef = ref();
const [BpmnPreviewModal, modalApi] = useVbenModal();
const diagramRef = ref();
const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: { diagramRef, openBpmnModal },
});

async function openBpmnModal(modelId) {
  await api.GetById(modelId).then((data) => {
    bpmnPreviewTitle.value = data?.diagramName;
    nextTick(() => {
      processXmlRef.value = data?.diagramData;
    });
    modalApi.open();
  });
}

onMounted(async () => {
  await crudExpose.doRefresh();
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding" />
    <DiagramPreview ref="diagramRef" />
  </fs-page>
</template>
