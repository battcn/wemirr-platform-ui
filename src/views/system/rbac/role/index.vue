<template>
  <div>
    <BasicTable @register="registerTable" @expand="handleExpandedChange">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-auth="'insert'"> 新增角色 </a-button>
        <!-- <a-button
          color="error"
          :preIcon="!loading ? 'ant-design:sync-outlined' : ''"
          @click="handleSyncProcess"
          v-auth="'sync-process-role'"
          :loading="loading"
          >同步流程</a-button
        > -->
        <a-button
          color="warning"
          preIcon="ant-design:cloud-sync-outlined"
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
      <template #roleStatus="{ record }">
        <a-badge status="processing" v-if="record.roleStatus == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <!-- <template #expandedRowRender="{ record }">
        <div style="text-align: center">
          <a-spin :spinning="data.meauActions[record.roleId]?.loading" />
        </div>
        <template v-if="!data.meauActions[record.roleId]?.loading">
          <a-empty
            v-if="
              !data.meauActions[record.roleId]?.data ||
              data.meauActions[record.roleId]?.data.length < 1
            "
          />
          <a-row :gutter="24" :style="{ marginBottom: '12px' }" v-else>
            <a-col
              :span="12"
              v-for="(permission, index) in data.meauActions[record.roleId].data"
              :key="index"
              :style="{ marginBottom: '12px' }"
            >
              <a-col :span="4">
                <span>{{ permission.metaTitle }}：</span>
              </a-col>
              <a-col :span="20" v-if="permission.actionSet && permission.actionSet.length > 0">
                <a-tag
                  color="green"
                  v-for="(action, k) in permission.actionSet"
                  :key="k"
                  style="margin-left: 4px; margin-bottom: 4px"
                  >{{ action.metaTitle }}</a-tag
                >
              </a-col>
              <a-col :span="20" v-else>-</a-col>
            </a-col>
          </a-row>
        </template>
      </template> -->
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              label: '编辑',
              tooltip: '编辑角色',
              auth: 'update',
              ifShow: () => !record.superRole,
              onClick: handleEdit.bind(null, record.roleId),
            },
            {
              icon: 'ant-design:api-outlined',
              label: '授权',
              color: 'success',
              auth: 'apiAuth',
              ifShow: () => !record.superRole,
              tooltip: '授予权限',
              onClick: handleAuth.bind(null, record.roleId),
            },
          ]"
          :dropDownActions="[
            {
              label: '详情',
              auth: 'dataAuth',
              onClick: handleDetail.bind(null, record.roleId),
            },
            {
              label: '删除',
              auth: 'delete',
              ifShow: () => record.enableDelete !== 0 && !record.superRole,
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.roleId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <RoleModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage, deleteById, getMenuActionById } from '/@/api/modules/system/rbac/rbacRole';
  import { useModal } from '/@/components/Modal';
  import RoleModal from './RoleModal.vue';
  import { router } from '/@/router';
  import { columns, searchFormSchema } from './role.data';
  // const loading = ref(false);
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: '角色列表',
    api: selectPage,
    rowKey: 'roleId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    indexColumnProps: {
      width: 60,
    },
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    bordered: true,
    expandRowByClick: true,
    // showIndexColumn: true,

    actionColumn: {
      width: 170,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      align: 'left',
    },
  });
  const data = reactive({
    meauActions: {},
  });
  async function handleExpandedChange(expanded, record) {
    data.meauActions[record.roleId] = {
      data: [],
      loading: true,
    };
    if (expanded) {
      try {
        data.meauActions[record.roleId].data = await getMenuActionById(record.roleId);
      } finally {
        data.meauActions[record.roleId].loading = false;
      }
    }
  }
  function handleImport() {}
  function handleExport() {}
  function handleDetail(roleId: string) {
    console.log('-handleDetail----roleId------', roleId);
  }
  function handleAuth(roleId: string) {
    router.push({
      name: 'FixedPageRoleInfo',
      query: {
        roleId: roleId,
      },
    });
  }
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  // async function handleSyncProcess() {
  //   loading.value = true;
  //   try {
  //     await syncProcess();
  //   } finally {
  //     loading.value = false;
  //   }
  // }

  function handleEdit(roleId: string) {
    openModal(true, {
      roleId,
      isUpdate: true,
    });
  }
  async function handleDelete(roleId: string) {
    await deleteById(roleId);
    reload();
  }
  function handleSuccess() {
    reload();
  }
</script>
