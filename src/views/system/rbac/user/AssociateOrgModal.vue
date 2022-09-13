<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :destroyOnClose="true"
    :title="getTitle"
    :draggable="false"
    @ok="handleSubmit"
    width="60%"
  >
    <BasicTable
      @register="registerTable"
      :searchInfo="searchInfo"
      :maxHeight="300"
      :rowSelection="{ type: 'checkbox' }"
      :row-selection="{
        selectedRowKeys: dataInfo.keys,
        onSelect: handleSelect,
        onSelectAll: handleSelectAll,
        type: 'checkbox',
      }"
    >
      <template #headerTop>
        <Alert type="info" show-icon>
          <template #message>
            <div style="display: flex">
              <div style="margin-right: 20px; font-weight: 450; display: flex; align-items: center">
                <div>
                  <span style="margin-right: 5px">已选择:</span>
                  <span class="text-yellow-600">{{ dataInfo.keys?.length || 0 }}</span>
                </div>
                <a-divider type="vertical" />
                <div>
                  <a-button type="link" size="small" @click="handleClear">清空</a-button>
                </div>
              </div>
            </div>
          </template>
        </Alert>
      </template>
      <template #avatar="{ record }">
        <a-avatar :size="33" :src="getPictureUrl(record.avatar)" v-if="record.avatar" />
      </template>
      <template #userStatus="{ record }">
        <a-badge status="default" v-if="record.userStatus == 0" text="未激活" />
        <a-badge status="processing" v-else-if="record.userStatus == 1" text="启用" />
        <a-badge status="warning" v-else-if="record.userStatus == 2" text="冻结" />
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { Alert } from 'ant-design-vue';
  import { message } from 'ant-design-vue';
  import { reactive, computed } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { selectEnableUserPage, joinOrg } from '/@/api/modules/system/rbac/rbacUser';
  import { getAttachmentUrl } from '/@/utils';
  import { associateColumns, associateSearchFormSchema } from './user.data';
  const emit = defineEmits(['success', 'register']);
  const dataInfo = reactive({
    keys: [] as string[],
    orgId: '',
    orgName: '',
  });
  const searchInfo = reactive<Recordable>({ orgId: '' });
  const [registerModal, { setModalProps, closeModal, changeOkLoading }] = useModalInner(
    async (data) => {
      setModalProps({ confirmLoading: false });
      dataInfo.keys = [];
      dataInfo.orgId = data?.orgId;
      dataInfo.orgName = data?.orgName;
      searchInfo.orgId = dataInfo.orgId;
      reload();
    },
  );
  const getTitle = computed(() =>
    !dataInfo.orgName ? '关联机构' : '关联机构:' + dataInfo.orgName,
  );
  const [registerTable, { reload }] = useTable({
    title: '待关联用户列表',
    api: selectEnableUserPage,
    rowKey: 'userId',
    columns: associateColumns,
    formConfig: {
      labelWidth: 70,
      schemas: associateSearchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
    },
    useSearchForm: true,
    showIndexColumn: false,
    showTableSetting: true,
    canResize: false,
    tableSetting: { fullScreen: false },
    bordered: true,
  });
  function getPictureUrl(url: string) {
    return getAttachmentUrl(url);
  }
  async function handleSubmit() {
    try {
      if (dataInfo.keys?.length <= 0) {
        message.error('请先选择用户');
        return;
      }
      changeOkLoading(true);
      const data = {
        orgId: dataInfo.orgId,
        userIds: dataInfo.keys,
      };
      await joinOrg(data);
      closeModal();
      emit('success');
    } finally {
      changeOkLoading(false);
    }
  }
  function handleSelect(record, selected) {
    if (selected) {
      dataInfo.keys.push(record.userId);
    } else {
      const findIndex = dataInfo.keys.findIndex((val) => val == record.userId);
      if (findIndex != -1) {
        dataInfo.keys.splice(findIndex, 1);
      }
    }
  }
  function handleSelectAll(selected, __selectedRows, changeRows) {
    if (selected) {
      changeRows.forEach((item) => {
        dataInfo.keys.push(item.userId);
      });
    } else {
      changeRows.forEach((item) => {
        const findIndex = dataInfo.keys.findIndex((val) => val == item.userId);
        if (findIndex != -1) {
          dataInfo.keys.splice(findIndex, 1);
        }
      });
    }
  }
  function handleClear() {
    dataInfo.keys = [];
  }
</script>
