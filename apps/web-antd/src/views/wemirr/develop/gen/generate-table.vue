<script lang="ts" setup>
import { onMounted } from 'vue';
import { ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import createCrudOptions from './generate-table-crud';
import DsTableList from './component/ds-table-list.vue';
import PreviewCode from './component/preview-code.vue';
const isModalVisible = ref(false);
const isModalVisiblePre = ref(false);
const previewId = ref('');

const showModal = () => {
  isModalVisible.value = true;
};

const handleClose = () => {
  crudExpose.doRefresh();
  isModalVisible.value = false;
};
const showModalPre = (tableId: string) => {
  console.log('tableId:', tableId);
  previewId.value = tableId;
  isModalVisiblePre.value = true;
};

const handleClosePre = () => {
  previewId.value = '';
  isModalVisiblePre.value = false;
};
// const userStore = useUserStore();
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
    <DsTableList :visible="isModalVisible" :onCloseDD="handleClose" />
    <PreviewCode
      :visible="isModalVisiblePre"
      :onClose="handleClosePre"
      :preId="previewId"
    />
  </fs-page>
</template>
