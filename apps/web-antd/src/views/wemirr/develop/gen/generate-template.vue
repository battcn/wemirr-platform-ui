<script lang="ts" setup>
import { onMounted } from 'vue';
import { ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';
import GenCodingEditor from './component/gen-coding-editor.vue';
const isModalVisible = ref(false);
const isViewEditor = ref(false);
const currentTemplateId = ref<string | null>(null);
import createCrudOptions from './generate-template-crud';
import * as api from './generate-template-api';
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
// const userStore = useUserStore();
const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: { showEditModal, showViewModal },
});
const handleSave = async (val: any) => {
  //保存数据
  console.log('保存数据', val);
  await api.createObj(val);
  crudExpose.doRefresh();
  handleClose();
};
const handleEdit = async (row: any) => {
  await api.editObj(row);
  //编辑数据
  console.log('编辑数据', row);
  crudExpose.doRefresh();
  handleClose();
};
// 页面打开后获取列表数据
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
      :visible="isModalVisible"
      :templateId="currentTemplateId"
      :onClose="handleClose"
      :onEdit="handleEdit"
      :onSave="handleSave"
      :isViewMode="isViewEditor"
    />
  </fs-page>
</template>
