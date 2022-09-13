<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    width="60%"
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #enabled="{ record }">
        <a-badge status="processing" v-if="record.enabled" text="上线" />
        <a-badge status="default" v-else text="下线" />
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              color: record.enabled ? 'warning' : 'success',
              icon: record.enabled
                ? 'ant-design:stop-outlined'
                : 'ant-design:check-circle-outlined',
              label: record.enabled ? '下线' : '上线',
              onClick: handleInstance.bind(null, record, record.enabled ? 0 : 1),
            },
          ]"
        />
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columnsInstance } from './service.data';
  import { selectInstancePage, updateInstance } from '/@/api/modules/system/manage/manageService';
  const searchInfo = reactive<Recordable>({});
  const serviceName = ref('');
  defineEmits(['success', 'register']);
  const [registerTable, { reload }] = useTable({
    api: selectInstancePage,
    rowKey: 'instanceId',
    columns: columnsInstance,
    useSearchForm: false,
    showTableSetting: true,
    showIndexColumn: false,
    canResize: false,
    tableSetting: { fullScreen: false },
    bordered: true,
    actionColumn: {
      width: 90,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  const [registerModal] = useModalInner(async (data) => {
    serviceName.value = data.serviceName;
    searchInfo.serviceCode = data.serviceCode;
    reload();
  });
  const getTitle = computed(() =>
    serviceName.value ? '服务实例(' + serviceName.value + ')' : '服务实例',
  );
  function handleInstance(record: Recordable, type: number) {
    const data = {
      serviceCode: searchInfo.serviceCode,
      instanceId: record.instanceId,
      type: type,
    };
    updateInstance(data);
    reload();
  }
</script>
