<script lang="ts" setup name="ReceivingPlanPageList">
import { onMounted, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import FsReceivingItem from '#/views/wemirr/wms/inbound/receivingPlan/receiving/index.vue';

import createCrudOptions from './crud';

// 保留子组件的ref引用
const receivingItemRef = ref();
// 通过context传递到crud.tsx中
const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: { receivingItemRef },
});

// 页面打开后获取列表数据
onMounted(async () => {
  await crudExpose.doRefresh();
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding" />
    <FsReceivingItem ref="receivingItemRef" />
  </fs-page>
</template>

<style lang="less" scoped>
.fs-crud-container {
  :deep(.fs-layout-card-body) {
    border-radius: initial;
  }
}
</style>
