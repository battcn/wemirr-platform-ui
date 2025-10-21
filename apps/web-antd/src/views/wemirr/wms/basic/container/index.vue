<script lang="ts" setup name="ContainerPage">
import { onMounted, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import createCrudOptions from './crud';
import ContainerSpec from './spec/index.vue';

// 通过context传递到crud.tsx中
const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions });
const dialogShow = ref(false);
function openUnitDialog() {
  dialogShow.value = true;
}

// 页面打开后获取列表数据
onMounted(async () => {
  await crudExpose.doRefresh();
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #actionbar-right>
        <fs-button icon="ph:barcode" type="primary" @click="openUnitDialog()">
          容器规格
        </fs-button>
      </template>
    </fs-crud>

    <a-drawer v-model:open="dialogShow" title="容器规格维护" width="70%">
      <div style=" position: relative;height: 100%">
        <ContainerSpec />
      </div>
    </a-drawer>
  </fs-page>
</template>
