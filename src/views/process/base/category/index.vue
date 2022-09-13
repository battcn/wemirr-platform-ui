<template>
  <div>
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'insert'"
          >新增类别</a-button
        >
        <a-button
          color="warning"
          preIcon="ant-design:cloud-upload-outlined"
          @click="handleImport"
          v-auth="'import'"
          >导入</a-button
        >
        <a-button
          color="success"
          preIcon="ant-design:cloud-download-outlined"
          @click="handleExport"
          v-auth="'export'"
          >导出</a-button
        >
      </template>
      <template #categoryState="{ record }">
        <a-badge status="processing" v-if="record.categoryState == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #pictures="{ record }">
        <a-avatar :size="20" :src="getPictureUrl(record.pictures)" shape="square" />
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '详情',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑',
              auth: 'update',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除',
              auth: 'delete',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.categoryId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <CategoryModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { getAttachmentUrl } from '/@/utils';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage, deleteById } from '/@/api/modules/process/base/processCategory';
  import { useModal } from '/@/components/Modal';
  import CategoryModal from './CategoryModal.vue';
  import { columns, searchFormSchema } from './category.data';
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();
  const [registerModal, { openModal }] = useModal();
  const searchInfo = reactive<Recordable>({});
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '类型列表',
    api: selectPage,
    rowKey: 'categoryId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    indexColumnProps: {
      width: 70,
    },
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    bordered: true,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(row) {
    openModal(true, {
      isUpdate: true,
      value: row,
    });
  }
  async function handleDelete(categoryId: string) {
    await deleteById(categoryId);
    reload();
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.categoryId, values);
    } else {
      reload();
    }
  }
  function handleImport() {}
  function handleExport() {}
  function getPictureUrl(url: string) {
    return getAttachmentUrl(url);
  }
  function handleView(categoryId: string) {
    go('/system/account_detail/' + categoryId);
  }
</script>
