<template>
  <Modal>
    <a-transfer
        :data-source="userRoleDetails"
        :target-keys="targetKeys"
        :show-search="showSearch"
        :filter-option="
        (inputValue: any, item: any) =>
          item.nickName.indexOf(inputValue) !== -1 || item.username.indexOf(inputValue) !== -1
      "
        :show-select-all="false"
        @change="onChange"
    >
      <template
          #children="{ direction, filteredItems, selectedKeys, onItemSelectAll, onItemSelect }"
      >
        <a-table
            :row-selection="getRowSelection({ selectedKeys, onItemSelectAll, onItemSelect })"
            :columns="direction === 'left' ? leftColumns : rightColumns"
            :data-source="filteredItems"
            size="small"
        />
      </template>
    </a-transfer>
  </Modal>
</template>

<script lang="ts" setup>
import {difference} from "lodash-es";
import {ref} from "vue";
import * as api from "./api";
import {useVbenModal} from '@vben/common-ui';

const tableColumns = [
  {dataIndex: "nickName", title: "名称"},
  {dataIndex: "username", title: "账号"},
];
// const modelRef = ref();
const showSearch = ref(true);
const leftColumns = ref(tableColumns);
const rightColumns = ref(tableColumns);
const userRoleDetails = ref([]);
const targetKeys = ref([]);
let modelRef = ref({
  roleId: null,
  userRoleDetails: [],
  originTargetKeys: [],
}) as Record<string, any>;
const [Modal, modalApi] = useVbenModal({
  title: '分配用户',
  class: 'm-distribution-user',
  draggable: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    api.DistributionUser({roleId: modelRef.value.roleId, userIdList: targetKeys.value})
        .then(() => {
          modalApi.close();
        });
  },
  onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      return
    }
    modelRef.value = modalApi.getData<Record<string, any>>();
    userRoleDetails.value = modelRef.value.userRoleDetails?.map((item: any) => {
      return {key: String(item.id), title: item.nickName, ...item};
    });
    targetKeys.value = modelRef.value.originTargetKeys?.map((key: any) => key.toString());
  },
});


const onChange = (nextTargetKeys: any) => {
  targetKeys.value = nextTargetKeys;
};
const getRowSelection = ({selectedKeys, onItemSelectAll, onItemSelect}: any) => {
  return {
    onSelectAll(selected: any, selectedRows: any) {
      const treeSelectedKeys = selectedRows.map(({key}: any) => key);
      const diffKeys = selected
          ? difference(treeSelectedKeys, selectedKeys)
          : difference(selectedKeys, treeSelectedKeys);
      onItemSelectAll(diffKeys, selected);
    },
    onSelect({key}: any, selected: any) {
      onItemSelect(key, selected);
    },
    selectedRowKeys: selectedKeys,
  };
}
</script>

<style lang="less">
.m-distribution-user {
  width: 75%;
  height: 75%;
}
</style>