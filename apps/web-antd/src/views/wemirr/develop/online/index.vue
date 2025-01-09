<script lang="ts" setup name="OnlinePage">
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
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_description="scope">
        <a-tooltip :title="scope.row.description" placement="top">
          {{ scope.row.description }}
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>
