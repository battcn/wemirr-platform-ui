<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_name="scope">
        <a-tooltip placement="top" :title="scope.row.name">
          {{ scope.row.name }}
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>

<script lang="ts" setup name="TenantPage">
import { onMounted } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";

//通过context传递到crud.tsx中
const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions });

// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});
</script>
