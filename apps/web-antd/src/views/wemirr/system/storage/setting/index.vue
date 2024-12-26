<script lang="ts" setup name="StorageSetting">
import { onMounted } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import createCrudOptions from './crud';

// 通过context传递到crud.tsx中
const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions });

// 页面打开后获取列表数据
onMounted(async () => {
  await crudExpose.doRefresh();
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_url="scope">
        <a-tooltip :title="scope.row.url" placement="leftTop">
          {{ scope.row.url }}
        </a-tooltip>
      </template>
      <template #cell_domain="scope">
        <a-tooltip :title="scope.row.domain" placement="top">
          {{ scope.row.domain }}
        </a-tooltip>
      </template>
      <template #cell_accessKey="scope">
        <a-tooltip :title="scope.row.accessKey" placement="top">
          {{ scope.row.accessKey }}
        </a-tooltip>
      </template>
      <template #cell_endPoint="scope">
        <a-tooltip :title="scope.row.endPoint" placement="top">
          {{ scope.row.endPoint }}
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>
