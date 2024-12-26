<script setup>
import { onMounted } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import createCrudOptions from './crud';

const { crudRef, crudBinding, crudExpose } = useFs({ createCrudOptions });
// 页面打开后获取列表数据
onMounted(async () => {
  await crudExpose.doRefresh();
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_procTaskName="scope">
        <a-tooltip :title="scope.row.procTaskName" placement="top">
          {{ scope.row.procTaskName }}
        </a-tooltip>
      </template>
      <template #cell_procInstName="scope">
        <a-tooltip :title="scope.row.procInstName" placement="top">
          {{ scope.row.procInstName }}
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>
