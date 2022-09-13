<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="expandTableAll">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-auth="'insert'"> 新增组织 </a-button>
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
      <template #orgStatus="{ record }">
        <a-badge status="processing" v-if="record.orgStatus == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看组织',
              onClick: handleDetail.bind(null, record.roleId),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑组织',
              auth: 'update',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              auth: 'delete',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.orgId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage, deleteById } from '/@/api/modules/system/rbac/rbacOrg';
  import { columns, searchFormSchema } from './org.data';
  import { router } from '/@/router';
  const [registerTable, { reload, expandAll }] = useTable({
    title: '组织列表',
    api: selectPage,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
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
    router.push({
      name: 'FixedPageOrgInfo',
    });
  }
  function handleEdit(record: Recordable) {
    router.push({
      name: 'FixedPageOrgInfo',
      query: {
        orgId: record.orgId,
      },
    });
  }
  function expandTableAll() {
    nextTick(expandAll);
  }
  function handleDetail() {}
  async function handleDelete(orgId: string) {
    await deleteById(orgId);
    reload();
  }
  function handleImport() {}
  function handleExport() {}
</script>
