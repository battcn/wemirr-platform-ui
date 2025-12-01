<script lang="ts" setup>
import type { Key } from 'ant-design-vue/es/table/interface';

import { defineProps, ref, watch } from 'vue';

import { Button, Input, message, Modal, Table } from 'ant-design-vue';

import { defHttp } from '#/api/request';

const props = defineProps<{
  onCloseDD: () => void;
  visible: boolean;
}>();

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
    const res = await defHttp.get('/suite/generate-table/ds/list', {
      params: { tableName },
    });
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
  await defHttp.post('/suite/generate-table/ds/import', tables);
  props.onCloseDD();
};

const handleClose = () => {
  selectedRowKeys.value = [];
  if (typeof props.onCloseDD === 'function') {
    props.onCloseDD();
  } else {
    console.error('props.onCloseDD is not a function');
  }
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
    @update:open="handleClose"
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
