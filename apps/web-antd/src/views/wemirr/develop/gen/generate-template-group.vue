<script lang="ts" setup>
import { onMounted } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import createCrudOptions from './generate-template-group-crud';

// const userStore = useUserStore();
const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: {},
});

// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding" />
  </fs-page>
</template>
