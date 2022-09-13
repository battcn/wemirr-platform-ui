<template>
  <div>
    <BasicTable @register="registerTable" @selection-change="handleSelectionChange">
      <template #toolbar>
        <a-button
          type="primary"
          danger
          v-show="data.keys.length > 0"
          :loading="loading.deleteBatch"
          :preIcon="!loading.deleteBatch ? 'ant-design:delete-outlined' : ''"
          @click="handleDeleteBatch"
          v-auth="'deleteBatch'"
          >批量删除</a-button
        >
        <a-button
          color="success"
          :loading="loading.export"
          :preIcon="!loading.export ? 'ant-design:cloud-download-outlined' : ''"
          @click="handleExport"
          v-auth="'export'"
          >导出</a-button
        >
      </template>
      <template #operateStatus="{ record }">
        <a-tag color="processing" v-if="record.operateStatus == 1"> 成功 </a-tag>
        <a-tag color="red" v-else>失败</a-tag>
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              label: '详情',
              onClick: handleView.bind(null, record.operateId),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              label: '删除',
              auth: 'delete',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.operateId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage, deleteById, deleteBatchByIds } from '/@/api/modules/logging/manage/operate';
  import { columns, searchFormSchema } from './operatelog.data';
  const [registerTable, { reload }] = useTable({
    title: '操作日志列表',
    api: selectPage,
    rowKey: 'operateId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    useSearchForm: true,
    indexColumnProps: {
      width: 70,
    },
    showTableSetting: true,
    clickToRowSelect: false,
    rowSelection: { type: 'checkbox' },
    tableSetting: { fullScreen: true },
    bordered: true,
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  const loading = reactive({
    deleteBatch: false,
    export: false,
  });
  const data = reactive({
    keys: [],
    logInfo: {},
  });
  function handleView(operateId: string) {
    console.log('----operateId-------', operateId);
  }
  async function handleDelete(operateId: string) {
    await deleteById(operateId);
    reload();
  }
  async function handleDeleteBatch() {
    try {
      loading.deleteBatch = true;
      await deleteBatchByIds(data.keys);
    } finally {
      loading.deleteBatch = false;
    }
    reload();
  }
  async function handleSelectionChange({ keys }) {
    data.keys = keys;
  }
  async function handleExport() {
    try {
      loading.export = true;
    } finally {
      loading.export = false;
    }
  }
</script>

<style lang="less">
  .copy-class {
    color: @primary-color;
    cursor: pointer;
  }
</style>
