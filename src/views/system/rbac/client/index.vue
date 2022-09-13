<template>
  <div>
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'insert'"
          >新增客户端</a-button
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
      <template #clientIco="{ record }">
        <a-avatar
          :size="30"
          :src="getPictureUrl(record.clientIco)"
          shape="square"
          v-if="record.clientIco"
        />
      </template>
      <template #clientStatus="{ record }">
        <a-badge status="processing" v-if="record.clientStatus == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              label: '编辑',
              tooltip: '编辑角色',
              auth: 'update',
              onClick: handleEdit.bind(null, record.clientDetailId),
            },
            {
              icon: 'ant-design:api-outlined',
              label: '授权',
              color: 'success',
              auth: 'apiAuth',
              tooltip: '授予权限',
              onClick: handleAuth.bind(null, record.clientDetailId),
            },
          ]"
          :dropDownActions="[
            {
              label: '详情',
              auth: 'dataAuth',
              onClick: handleView.bind(null, record.clientDetailId),
            },
            {
              label: '删除',
              auth: 'delete',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.clientDetailId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <ClientModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage, deleteById } from '/@/api/modules/system/rbac/rbacClientDetails';
  import { getAttachmentUrl } from '/@/utils';
  import { useModal } from '/@/components/Modal';
  import ClientModal from './ClientModal.vue';
  import { columns, searchFormSchema } from './client.data';
  import { useGo } from '/@/hooks/web/usePage';
  import { router } from '/@/router';
  const go = useGo();
  const [registerModal, { openModal }] = useModal();
  const searchInfo = reactive<Recordable>({});
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '客户端列表',
    api: selectPage,
    rowKey: 'clientDetailId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    indexColumnProps: {
      width: 110,
    },
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    bordered: true,
    actionColumn: {
      width: 160,
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

  function handleEdit(clientDetailId: string) {
    openModal(true, {
      isUpdate: true,
      clientDetailId,
    });
  }
  function handleAuth(clientDetailId: string) {
    router.push({
      name: 'FixedPageClientInfo',
      query: {
        clientDetailId,
      },
    });
  }
  function getPictureUrl(url: string) {
    return getAttachmentUrl(url);
  }
  async function handleDelete(clientDetailId: string) {
    await deleteById(clientDetailId);
    reload();
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.clientDetailId, values);
    } else {
      reload();
    }
  }
  function handleImport() {}
  function handleExport() {}

  function handleView(clientDetailId: string) {
    go('/system/account_detail/' + clientDetailId);
  }
</script>
