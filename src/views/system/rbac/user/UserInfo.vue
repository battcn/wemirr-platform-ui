<template>
  <div>
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleAssociate(orgId)"
          v-auth="'insert'"
          :disabled="!orgId"
          >关联已有用户</a-button
        >
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'insert'"
          >新增用户</a-button
        >
        <!-- <a-button
          color="error"
          :preIcon="!loading ? 'ant-design:sync-outlined' : ''"
          @click="handleSyncProcess"
          :loading="loading"
          v-auth="'sync-process-user'"
          >同步流程</a-button
        > -->
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
      <template #avatar="{ record }">
        <a-avatar :size="33" :src="getPictureUrl(record.avatar)" v-if="record.avatar" />
      </template>
      <template #userStatus="{ record }">
        <a-badge status="default" v-if="record.userStatus == 0" text="未激活" />
        <a-badge status="processing" v-else-if="record.userStatus == 1" text="启用" />
        <a-badge status="warning" v-else-if="record.userStatus == 2" text="冻结" />
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看用户详情',
              onClick: handleView.bind(null, record.userId),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑用户资料',
              auth: 'update',
              onClick: handleEdit.bind(null, record.userId),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              auth: 'delete',
              tooltip: '删除此账号',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.userId),
              },
            },
          ]"
          :dropDownActions="[
            {
              label: '移除机构',
              ifShow: () => (orgId ? true : false),
              auth: 'removeOrg',
              popConfirm: {
                title: `确定要把'${record.userName}'移除'${orgName}'机构吗？`,
                confirm: handleRemoveOrg.bind(null, record.userId),
              },
            },
            {
              label: '重置密码',
              auth: 'resetPassword',
              onClick: handleEdit.bind(null, record.userId),
            },
          ]"
        />
      </template>
    </BasicTable>
    <AssociateOrgModal @register="registerModal" @success="handleAssociateSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage, deleteById, removeOrg } from '/@/api/modules/system/rbac/rbacUser';
  import { getAttachmentUrl } from '/@/utils';
  import { router } from '/@/router';
  import { useRoute } from 'vue-router';
  import AssociateOrgModal from './AssociateOrgModal.vue';
  import { columns, searchFormSchema } from './user.data';
  import { useGo } from '/@/hooks/web/usePage';
  const [registerModal, { openModal }] = useModal();
  const route = useRoute();
  const params = reactive(route.query as any);
  const props = defineProps({
    orgId: {
      type: String,
      default: '',
    },
    orgName: {
      type: String,
      default: '',
    },
  });
  watch(
    () => props.orgId,
    (val, old) => {
      if (val != old) {
        handleOrgChange(val);
      }
    },
  );
  // const loading = ref(false);
  const go = useGo();
  const searchInfo = reactive<Recordable>({});
  const [registerTable, { reload }] = useTable({
    title: '用户列表',
    api: selectPage,
    rowKey: 'userId',
    columns,
    formConfig: {
      labelWidth: 68,
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
    canResize: true,
    tableSetting: { fullScreen: true },
    bordered: true,
    actionColumn: {
      width: 150,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  function handleCreate() {
    router.push({
      name: 'FixedPageUserInfo',
      query: {
        orgId: props.orgId,
        orgName: props.orgName,
      },
    });
  }
  function handleAssociate(orgId: string) {
    openModal(true, {
      orgId,
      orgName: props.orgName,
    });
  }
  async function handleRemoveOrg(userId: string) {
    await removeOrg(userId, props.orgId);
    reload();
  }
  // async function handleSyncProcess() {
  //   loading.value = true;
  //   try {
  //     await syncProcess();
  //   } finally {
  //     loading.value = false;
  //   }
  // }

  function handleEdit(userId: string) {
    router.push({
      name: 'FixedPageUserInfo',
      query: {
        orgId: params.orgId,
        userId,
      },
    });
  }
  function getPictureUrl(url: string) {
    return getAttachmentUrl(url);
  }
  async function handleDelete(userId: string) {
    await deleteById(userId);
    reload();
  }
  function handleImport() {}
  function handleExport() {}
  function handleOrgChange(orgId) {
    searchInfo.orgId = orgId;
    reload();
  }
  function handleAssociateSuccess() {
    reload();
  }

  function handleView(record: Recordable) {
    go('/system/account_detail/' + record.id);
  }
</script>
