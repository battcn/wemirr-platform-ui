<script lang="ts" setup name="LocationPage">
import { onMounted, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import LocationSpec from '#/views/wemirr/wms/basic/location/spec/index.vue';

import createCrudOptions from './crud';

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
          储位规格
        </fs-button>
      </template>
    </fs-crud>

    <a-drawer v-model:open="dialogShow" title="储位规格维护" width="70%">
      <div style=" position: relative;height: 100%">
        <LocationSpec />
      </div>
    </a-drawer>
  </fs-page>
</template>
