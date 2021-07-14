<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="绑定用户"
    width="1000px"
    @ok="handleSubmit"
  >
    <a-transfer
      :data-source="userRoleDetails"
      :target-keys="targetKeys"
      :show-search="showSearch"
      :filter-option="
        (inputValue, item) =>
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
  </BasicModal>
</template>

<script>
  import { difference } from 'lodash-es';
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import * as api from './api';

  const tableColumns = [
    { dataIndex: 'nickName', title: '名称' },
    { dataIndex: 'username', title: '账号' },
  ];

  export default defineComponent({
    name: 'DistributionUser',
    components: { BasicModal },
    setup() {
      const modelRef = ref({});
      const showSearch = ref(true);
      const leftColumns = ref(tableColumns);
      const rightColumns = ref(tableColumns);
      const userRoleDetails = ref([]);
      const targetKeys = ref([]);

      const [register, { closeModal }] = useModalInner((data) => {
        modelRef.value = {
          userRoleDetails: data.userRoleDetails,
          originTargetKeys: data.originTargetKeys,
        };
        userRoleDetails.value = data.userRoleDetails;
        targetKeys.value = data.originTargetKeys;
      });

      const onChange = (nextTargetKeys) => {
        targetKeys.value = nextTargetKeys;
      };

      const getRowSelection = ({ selectedKeys, onItemSelectAll, onItemSelect }) => {
        return {
          onSelectAll(selected, selectedRows) {
            const treeSelectedKeys = selectedRows.map(({ key }) => key);
            const diffKeys = selected
              ? difference(treeSelectedKeys, selectedKeys)
              : difference(selectedKeys, treeSelectedKeys);
            onItemSelectAll(diffKeys, selected);
          },
          onSelect({ key }, selected) {
            onItemSelect(key, selected);
          },
          selectedRowKeys: selectedKeys,
        };
      };
      async function handleSubmit() {
        api.DistributionUser({ roleId: 1, userIdList: targetKeys.value });
        // console.log('leftColumns', leftColumns.value);
        // console.log('rightColumns', rightColumns.value);
        // console.log('targetKeys', targetKeys.value);
        closeModal();
      }

      return {
        userRoleDetails,
        targetKeys,
        showSearch,
        leftColumns,
        rightColumns,
        handleSubmit,
        onChange,
        getRowSelection,
        register,
        closeModal,
        model: modelRef,
      };
    },
  });
</script>
