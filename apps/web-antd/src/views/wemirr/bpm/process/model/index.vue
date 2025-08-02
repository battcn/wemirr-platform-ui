<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import DiagramPreview from '#/views/wemirr/bpm/task/complete/DiagramPreview.vue';

import createCrudOptions from './crud';

const diagramRef = ref();
const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: { diagramRef },
});

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
