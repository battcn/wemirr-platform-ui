<template>
  <div>
    <BasicTable @register="registerTable" @expand="handleExpandedChange" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-auth="'insert'"> 新增角色 </a-button>
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
          <a-spin :spinning="data.meauActions[record.orgRoleId]?.loading" />
        </div>
        <template v-if="!data.meauActions[record.orgRoleId]?.loading">
          <a-empty
            v-if="
              !data.meauActions[record.orgRoleId]?.data ||
              data.meauActions[record.orgRoleId]?.data.length < 1
            "
          />
          <a-row :gutter="24" :style="{ marginBottom: '12px' }" v-else>
            <a-col
              :span="12"
              v-for="(permission, index) in data.meauActions[record.orgRoleId].data"
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
              onClick: handleEdit.bind(null, record.orgRoleId),
            },
            {
              icon: 'ant-design:api-outlined',
              label: '授权',
              color: 'success',
              auth: 'apiAuth',
              tooltip: '授予权限',
              onClick: handleAuth.bind(null, record.orgRoleId),
            },
          ]"
          :dropDownActions="[
            {
              label: '详情',
              auth: 'dataAuth',
              onClick: handleDetail.bind(null, record.orgRoleId),
            },
            {
              label: '删除',
              auth: 'delete',
              ifShow: () => record.enableDelete !== 0 && !record.superRole,
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.orgRoleId),
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
  import { reactive, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    selectPage,
    deleteById,
    getMenuActionById,
  } from '/@/api/modules/system/rbac/rbacOrgRole';
  import { useModal } from '/@/components/Modal';
  import RoleModal from './RoleModal.vue';
  import { router } from '/@/router';
  import { columns, searchFormSchema } from './orgRole.data';
  const props = defineProps({
    orgId: {
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
  const searchInfo = reactive<Recordable>({});
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: '机构角色列表',
    api: selectPage,
    rowKey: 'orgRoleId',
    columns,
    formConfig: {
      labelWidth: 68,
      schemas: searchFormSchema,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    indexColumnProps: {
      width: 60,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    tableSetting: { fullScreen: true },
    expandRowByClick: true,
    actionColumn: {
      width: 200,
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
    data.meauActions[record.orgRoleId] = {
      data: [],
      loading: true,
    };
    if (expanded) {
      try {
        data.meauActions[record.orgRoleId].data = await getMenuActionById(record.orgRoleId);
      } finally {
        data.meauActions[record.orgRoleId].loading = false;
      }
    }
  }
  function handleOrgChange(orgId: string) {
    searchInfo.orgId = orgId;
    if (orgId) {
      reload();
    }
  }
  function handleAuth(orgRoleId: string) {
    router.push({
      name: 'FixedPageOrgRoleInfo',
      query: {
        orgRoleId,
        orgId: props.orgId,
      },
    });
  }
  function handleImport() {}
  function handleExport() {}
  function handleDetail(orgRoleId: string) {
    console.log('-handleDetail----orgRoleId------', orgRoleId);
  }
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
      orgId: props.orgId,
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

  function handleEdit(orgRoleId: string) {
    openModal(true, {
      orgRoleId,
      orgId: props.orgId,
      isUpdate: true,
    });
  }
  async function handleDelete(orgRoleId: string) {
    await deleteById(orgRoleId);
    reload();
  }
  function handleSuccess() {
    reload();
  }
</script>
