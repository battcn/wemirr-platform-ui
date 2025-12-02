<script lang="ts" setup>
import type { Key } from 'ant-design-vue/es/table/interface';

import { ref, watch } from 'vue';

import { Button, Input, message, Modal, Table } from 'ant-design-vue';

import * as api from '../generate-table-api';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(['close', 'update:visible', 'success']);

const dataSource = ref([]);
const loading = ref(false);
const selectedRowKeys = ref<Key[]>([]);
const searchQuery = ref('');

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'comment',
    dataIndex: 'comment',
    key: 'comment',
  },
  {
    title: 'createTime',
    dataIndex: 'createTime',
    key: 'createTime',
  },
];

const fetchData = async (tableName = '') => {
  loading.value = true;
  try {
    const res = await api.GetDsList({ tableName });
    dataSource.value = res;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  } finally {
    loading.value = false;
  }
};
const handleSearch = () => {
  fetchData(searchQuery.value);
};
const handleSelectChange = (selectedKeys: Key[]) => {
  selectedRowKeys.value = selectedKeys;
};

const executeImport = async () => {
  const tables = selectedRowKeys.value;
  if (tables.length === 0) {
    message.warning('请至少选择一个表');
    return;
  }
  await api.ImportDs(tables);
  emit('success');
  handleClose();
};

const handleClose = () => {
  selectedRowKeys.value = [];
  emit('close');
  emit('update:visible', false);
};

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      fetchData();
    }
  },
);
</script>

<template>
  <Modal
    :footer="null"
    :open="props.visible"
    title="未配置可导入的表信息"
    width="70%"
    @cancel="handleClose"
  >
    <div style="margin-bottom: 16px">
      <Input.Search
        v-model:value="searchQuery"
        enter-button
        placeholder="表名..."
        @search="handleSearch"
      />
    </div>
    <Table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :row-selection="{
        selectedRowKeys,
        onChange: handleSelectChange,
      }"
      :scroll="{ y: 300 }"
      row-key="name"
    />
    <div style="margin-top: 16px; text-align: right">
      <Button type="primary" @click="executeImport">导入</Button>
    </div>
  </Modal>
</template>
