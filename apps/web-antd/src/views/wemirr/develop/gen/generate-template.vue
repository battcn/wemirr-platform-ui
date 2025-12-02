<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import GenCodingEditor from './component/gen-coding-editor.vue';
import * as api from './generate-template-api';
import createCrudOptions from './generate-template-crud';

const isModalVisible = ref(false);
const isViewEditor = ref(false);
const currentTemplateId = ref<null | string>(null);

const showAddModal = () => {
  currentTemplateId.value = null;
  isModalVisible.value = true;
};

const showEditModal = (templateId: string) => {
  currentTemplateId.value = templateId;
  isViewEditor.value = false;
  isModalVisible.value = true;
};
const showViewModal = (templateId: string) => {
  currentTemplateId.value = templateId;
  isViewEditor.value = true;
  isModalVisible.value = true;
};
const handleClose = () => {
  isModalVisible.value = false;
  isViewEditor.value = false;
};

const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: { showEditModal, showViewModal },
});

const handleSave = async (val: any) => {
  await api.AddObj(val);
  crudExpose.doRefresh();
  handleClose();
};
const handleEdit = async (row: any) => {
  await api.UpdateObj(row);
  crudExpose.doRefresh();
  handleClose();
};

onMounted(() => {
  crudExpose.doRefresh();
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #actionbar-left>
        <a-button type="primary" @click="showAddModal"> 添加配置 </a-button>
      </template>
      <template #cell_generatePath="scope">
        <a-tooltip :title="scope.row.generatePath" placement="top">
          {{ scope.row.generatePath }}
        </a-tooltip>
      </template>
    </fs-crud>
    <GenCodingEditor
      v-model:visible="isModalVisible"
      :template-id="currentTemplateId"
      :is-view-mode="isViewEditor"
      @close="handleClose"
      @edit="handleEdit"
      @save="handleSave"
    />
  </fs-page>
</template>
