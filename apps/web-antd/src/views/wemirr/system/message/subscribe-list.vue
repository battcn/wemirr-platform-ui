<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_content="scope">
        <a-tooltip placement="top" :title="scope.row.content">
          {{ scope.row.content }}
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>

<script lang="ts" setup name="SubscribeList">
import { onMounted } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import createCrudOptions from "./subscribe-list";

//通过context传递到crud.tsx中
const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions });

// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});
</script>
