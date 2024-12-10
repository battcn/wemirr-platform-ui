<script lang="ts" setup name="AssignResource">
import { computed, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { notification } from 'ant-design-vue';

import { getAllMenusApi } from '#/api';
import * as api from '#/views/wemirr/system/auth/role/api';

const modelRef = ref({ roleId: null });

const [Modal, modalApi] = useVbenModal({
  title: '功能权限',
  class: 'm-assign-resource',
  draggable: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    api
      .assignResource({
        roleId: modelRef.value.roleId,
        resIdList: getAllSelectedIds.value,
      })
      .then(() => {
        notification.success({
          message: '权限分配成功',
          duration: 3,
        });
        modalApi.close();
      });
  },
  onOpenChange(isOpen: boolean) {
    if (!isOpen) return;

    getAllMenusApi({status: true}).then((ret) => {
      treeData.value = ret;
      expandedKeys.value = ret
        .filter((item: any) => item.parentId === '0')
        .map((item: any) => item.id);
      modelRef.value = modalApi.getData<Record<string, any>>();
      api.getRolePermissions(modelRef.value.roleId).then((ret) => {
        selectedTableKeys.value = ret.buttonIdList;
        checkedTreeKeys.value = ret.menuIdList;
      });
    });
  },
});

const treeData = ref([]);
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', hidden: true },
  { title: '权限编码', dataIndex: 'permission', key: 'permission' },
  { title: '名称', dataIndex: 'title', key: 'title' },
  { title: '描述', dataIndex: 'description', key: 'description' },
];

const selectedTreeKeys = ref([]);
const checkedTreeKeys = ref([]);
const expandedKeys = ref([]);
const selectedTableKeys = ref([]);
const tableData = ref([]);
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
});

const rowSelection = reactive({
  selectedRowKeys: selectedTableKeys,
  preserveSelectedRowKeys: true,
  onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
    selectedTableKeys.value = selectedRowKeys;
  },
});

const getAllSelectedIds = computed(() => {
  const treeIds = checkedTreeKeys.value || [];
  const tableIds = selectedTableKeys.value || [];
  const currentTableIds = new Set(tableData.value.map((item) => item.id));
  const filteredTreeIds = treeIds.filter((id) => !currentTableIds.has(id));
  return [...new Set([...filteredTreeIds, ...tableIds])];
});

const handleTreeSelect = async (selectedKeys, event) => {
  if (!event.selected) return;
  const selectNode = event.selectedNodes[0];
  if (selectedKeys.length > 0) {
    await loadTableData(selectNode.id);
  }
};

const loadTableData = async (parentId) => {
  try {
    const ret = await api.GetResourceList({ type: 'button', parentId });
    tableData.value = ret.records;
    pagination.value.total = Number(ret.total);
  } catch (error) {
    console.error('加载数据失败:', error);
  }
};

const handleTableChange = (pag) => {
  pagination.value = pag;
  loadTableData(selectedTreeKeys.value[0]);
};
</script>

<template>
  <Modal>
    <a-row>
      <a-col :span="6">
        <a-tree
          v-model:checked-keys="checkedTreeKeys"
          v-model:expanded-keys="expandedKeys"
          v-model:selected-keys="selectedTreeKeys"
          :auto-expand-parent="true"
          :default-expand-all="true"
          :field-names="{ key: 'id', title: 'title' }"
          :tree-data="treeData"
          checkable
          @select="handleTreeSelect"
        />
      </a-col>
      <a-col :span="18">
        <a-table
          :columns="columns.filter((column) => !column.hidden)"
          :data-source="tableData"
          :pagination="pagination"
          :row-key="(record) => record.id"
          :row-selection="rowSelection"
          bordered
          @change="handleTableChange"
        />
      </a-col>
    </a-row>
  </Modal>
</template>

<style lang="less">
.m-assign-resource {
  width: 75%;
  height: 75%;
}
</style>
