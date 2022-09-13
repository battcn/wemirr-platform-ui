<template>
  <div>
    <BasicTable @register="registerTable" :searchInfo="searchInfo" :beforeFetch="beforeFetch">
      <template #toolbar>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate"
          >新增服务</a-button
        >
        <a-button
          color="error"
          :preIcon="!loadingSync ? 'ant-design:sync-outlined' : ''"
          :loading="loadingSync"
          @click="handleSyncGateway"
          >刷新网关</a-button
        >
        <a-button color="warning" preIcon="ant-design:cloud-upload-outlined" @click="handleImport"
          >导入</a-button
        >
        <a-button color="success" preIcon="ant-design:cloud-download-outlined" @click="handleExport"
          >导出</a-button
        >
      </template>
      <template #serviceInstanceState="{ record }">
        {{ record.healthyNum }}/{{ record.instanceNum }}
        <Progress
          :percent="(record.healthyNum / record.instanceNum) * 100"
          size="small"
          :stroke-color="{
            '0%': '#108ee9',
            '100%': '#87d068',
          }"
          v-if="record.instanceNum > 0"
        />
        <Progress :percent="0" size="small" v-else />
      </template>
      <template #serviceState="{ record }">
        <a-badge status="processing" v-if="record.serviceState == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #headerTop>
        <Alert type="info" show-icon>
          <template #message>
            <div style="display: flex">
              <div style="margin-right: 20px; font-weight: 450">
                <span style="margin-right: 5px">纳入管理总服务数:</span>
                <span>{{ statInfo.manageTotalService }}</span>
              </div>
              <div style="margin-right: 20px; font-weight: 450">
                <span style="margin-right: 5px">未纳入管理总服务数:</span>
                <span>{{ statInfo.notManageTotalService }}</span>
              </div>
              <div style="margin-right: 20px; font-weight: 450">
                <span style="margin-right: 5px">系统实例数:</span>
                <span>{{ statInfo.healthyInstanceCount }}</span>
              </div>
              <div style="margin-right: 20px; font-weight: 450" class="text-yellow-600">
                <span style="margin-right: 5px">系统异常实例数:</span>
                <span>{{ statInfo.noHealthyInstanceCount }}</span>
              </div>
            </div>
          </template>
        </Alert>
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑',
              onClick: handleEdit.bind(null, record.serviceId),
            },
            {
              icon: 'ant-design:security-scan-outlined',
              tooltip: '过滤器',
              onClick: handleFilter.bind(null, record),
            },
            {
              icon: 'ant-design:api-outlined',
              tooltip: '路由',
              color: 'error',
              onClick: handleRouter.bind(null, record),
            },
            {
              icon: 'ant-design:deployment-unit-outlined',
              tooltip: '实例',
              onClick: handleInstance.bind(null, record),
              ifShow: () => record.instanceNum != 0,
            },
          ]"
          :dropDownActions="[
            {
              label: '详情',
              onClick: handleView.bind(null, record),
            },
            {
              label: record.serviceState == 1 ? '禁用' : '启用',
              onClick: handleView.bind(null, record.serviceId),
            },
            {
              label: '删除',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.serviceId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <ModalService @register="registerModal" @success="handleSuccess" />
    <ModalServiceInstance @register="registerInstanceModal" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import ModalService from './ModalService.vue';
  import ModalServiceInstance from './ModalServiceInstance.vue';
  import { router } from '/@/router';
  import { columns, searchFormSchema } from './service.data';
  import { useGo } from '/@/hooks/web/usePage';
  import {
    selectPage,
    systemStat,
    syncGateway,
    deleteById,
  } from '/@/api/modules/system/manage/manageService';
  import { SystemStatDto } from '/@/api/modules/system/manage/model/manageServiceModel';
  import { Alert, Progress } from 'ant-design-vue';
  const go = useGo();
  const [registerModal, { openModal }] = useModal();
  const [registerInstanceModal, { openModal: openInstanceModal }] = useModal();
  const searchInfo = reactive<Recordable>({});
  const loadingSync = ref(false);
  const statInfo = ref<SystemStatDto>({
    manageTotalService: 0,
    notManageTotalService: 0,
    healthyInstanceCount: 0,
    noHealthyInstanceCount: 0,
  });
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '服务列表',
    api: selectPage,
    rowKey: 'serviceId',
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
      fixed: 'left',
    },
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    bordered: true,
    actionColumn: {
      width: 190,
      title: '操作',
      align: 'left',
      fixed: 'right',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }
  function handleEdit(serviceId: string) {
    openModal(true, {
      isUpdate: true,
      id: serviceId,
    });
  }
  async function handleDelete(serviceId: string) {
    await deleteById(serviceId);
    reload();
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
    getSystemStat();
  }
  async function getSystemStat() {
    const data = await systemStat();
    statInfo.value = data;
  }
  function handleImport() {}
  function handleExport() {}
  function handleRouter(record: Recordable) {
    router.push({
      name: 'FixedPageServiceRouter',
      query: {
        serviceId: record.serviceId,
        serviceName: record.serviceName,
        serviceCode: record.serviceCode,
        isLoadBalancer: record.isLoadBalancer,
      },
    });
  }
  function handleFilter(record: Recordable) {
    router.push({
      name: 'FixedPageCustomFilter',
      query: {
        serviceId: record.serviceId,
        serviceName: record.serviceName,
      },
    });
  }
  function beforeFetch(record: Recordable) {
    getSystemStat();
    return record;
  }
  async function handleSyncGateway() {
    loadingSync.value = true;
    try {
      await syncGateway();
    } finally {
      loadingSync.value = false;
    }
  }
  function handleInstance(record: Recordable) {
    openInstanceModal(true, {
      serviceName: record.serviceName,
      serviceCode: record.serviceCode,
    });
  }
  onMounted(() => {
    getSystemStat();
  });
  function handleView(systemId: string) {
    go('/system/account_detail/' + systemId);
  }
</script>
