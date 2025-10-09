<script setup>
import { onMounted, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import ApprovalHandle from '#/views/wemirr/workflow/task/complete/ApprovalHandle.vue';
import DiagramPreview from '#/views/wemirr/workflow/task/complete/DiagramPreview.vue';

import createCrudOptions from './crud';

const diagramRef = ref();
const approvalRef = ref();
const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: { diagramRef, approvalRef },
});
// 页面打开后获取列表数据
onMounted(async () => {
  await crudExpose.doRefresh();
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_name="scope">
        <a-tooltip :title="scope.row.procInstName" placement="top">
          {{ scope.row.procInstName }}
        </a-tooltip>
      </template>
    </fs-crud>
    <DiagramPreview ref="diagramRef" />
    <ApprovalHandle ref="approvalRef" />
  </fs-page>
</template>
