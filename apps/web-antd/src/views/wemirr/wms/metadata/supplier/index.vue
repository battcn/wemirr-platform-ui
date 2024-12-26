<script lang="ts" setup name="ContainerSpecPage">
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
      <template #cell_businessScope="scope">
        <a-tooltip :title="scope.row.businessScope" placement="topLeft">
          {{ scope.row.businessScope }}
        </a-tooltip>
      </template>
      <template #cell_address="scope">
        <a-tooltip :title="scope.row.address" placement="topLeft">
          {{ scope.row.address }}
        </a-tooltip>
      </template>
      <template #cell_name="scope">
        <a-tooltip :title="scope.row.name" placement="topLeft">
          {{ scope.row.name }}
        </a-tooltip>
      </template>
      <template #cell_enterpriseType="scope">
        <a-tooltip :title="scope.row.enterpriseType" placement="topLeft">
          {{ scope.row.enterpriseType }}
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>
