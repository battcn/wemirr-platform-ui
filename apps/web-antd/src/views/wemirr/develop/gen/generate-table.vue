<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import DsTableList from './component/ds-table-list.vue';
import PreviewCode from './component/preview-code.vue';
import createCrudOptions from './generate-table-crud';

const isModalVisible = ref(false);
const isModalVisiblePre = ref(false);
const previewId = ref('');

const showModal = () => {
  isModalVisible.value = true;
};

const showModalPre = (tableId: string) => {
  previewId.value = tableId;
  isModalVisiblePre.value = true;
};

const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: { showModalPre },
});

// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #actionbar-left>
        <a-button type="primary" @click="showModal"> 添加配置 </a-button>
      </template>
      <template #cell_rootDir="scope">
        <a-tooltip :title="scope.row.rootDir" placement="top">
          {{ scope.row.rootDir }}
        </a-tooltip>
      </template>
      <template #cell_parentPackage="scope">
        <a-tooltip :title="scope.row.parentPackage" placement="top">
          {{ scope.row.parentPackage }}
        </a-tooltip>
      </template>
    </fs-crud>
    <DsTableList
      v-model:visible="isModalVisible"
      @success="crudExpose.doRefresh"
    />
    <PreviewCode v-model:visible="isModalVisiblePre" :pre-id="previewId" />
  </fs-page>
</template>
