<template>
  <div>
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'insert'"
          >新增系统</a-button
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
      <template #icon="{ record }">
        <a-avatar :size="30" :src="getPictureUrl(record.icon)" shape="square" v-if="record.icon" />
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '详情',
              onClick: handleView.bind(null, record.systemId),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑',
              auth: 'update',
              onClick: handleEdit.bind(null, record.systemId),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除',
              auth: 'delete',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.systemId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <SystemModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage, deleteById } from '/@/api/modules/system/rbac/rbacSystem';
  import { getAttachmentUrl } from '/@/utils';
  import { useModal } from '/@/components/Modal';
  import SystemModal from './SystemModal.vue';

  import { columns, searchFormSchema } from './system.data';
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();
  const [registerModal, { openModal }] = useModal();
  const searchInfo = reactive<Recordable>({});
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '系统列表',
    api: selectPage,
    rowKey: 'systemId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    bordered: true,
    actionColumn: {
      width: 100,
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

  function handleEdit(systemId: string) {
    openModal(true, {
      isUpdate: true,
      systemId: systemId,
    });
  }
  function getPictureUrl(url: string) {
    return getAttachmentUrl(url);
  }
  async function handleDelete(systemId: string) {
    await deleteById(systemId);
    reload();
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.systemId, values);
    } else {
      reload();
    }
  }
  function handleImport() {}
  function handleExport() {}

  function handleView(systemId: string) {
    go('/system/account_detail/' + systemId);
  }
</script>
