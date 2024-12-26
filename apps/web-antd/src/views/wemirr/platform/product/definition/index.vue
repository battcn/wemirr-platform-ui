<script lang="ts" setup>
import { onMounted } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useFs } from '@fast-crud/fast-crud';

import AssignResource from './assign-resource.vue';
import createCrudOptions from './crud';

const [AssignResourceModal, resourceModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: AssignResource,
});

function assignModal() {
  function resourceModal(productId: string) {
    resourceModalApi.setData({ productId });
    resourceModalApi.open();
  }
  return {
    resourceModal,
  };
}

const assign = assignModal();
const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: {
    assign,
    permission: 'product:definition',
  },
});

// 页面打开后获取列表数据
onMounted(async () => {
  await crudExpose.doRefresh();
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding" />
    <AssignResourceModal />
  </fs-page>
</template>
