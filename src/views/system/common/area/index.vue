<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="expandTableAll">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增区域 </a-button>
        <a-button color="warning" preIcon="ant-design:cloud-upload-outlined" @click="handleImport"
          >导入</a-button
        >
        <a-button color="success" preIcon="ant-design:cloud-download-outlined" @click="handleExport"
          >导出</a-button
        >
      </template>
      <template #orgStatus="{ record }">
        <a-badge status="processing" v-if="record.orgStatus == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '详情',
              onClick: handleView.bind(null, record.areaId),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑',
              onClick: handleEdit.bind(null, record.areaId),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.areaId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <OrgModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage, deleteById } from '/@/api/modules/system/common/commonArea';

  import { useModal } from '/@/components/Modal';
  import OrgModal from './AreaModal.vue';

  import { columns, searchFormSchema } from './area.data';
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, expandAll, updateTableDataRecord }] = useTable({
    title: '区域列表',
    api: selectPage,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    indentSize: 10,
    isTreeTable: true,
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    bordered: true,
    canResize: true,
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
    },
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }
  function expandTableAll() {
    nextTick(expandAll);
  }
  async function handleDelete(areaId: string) {
    await deleteById(areaId);
    reload();
  }
  function handleImport() {}
  function handleExport() {}
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.orgId, values);
    } else {
      reload();
    }
  }
  function handleView(areaId: string) {
    go('/system/account_detail/' + areaId);
  }
</script>
