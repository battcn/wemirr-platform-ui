<script lang="ts" setup name="AssignResource">
import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Card, notification } from 'ant-design-vue';

import { getAllMenusApi } from '#/api';

import * as api from './api';

const expandedKeys = ref<string[]>([]);
const checkedKeys = ref<string[]>([]);
const resIdList = ref([...new Set()] as unknown as any[]);
const treeData = ref();
const itemTableRef = ref();
function handleSelect(checkedKeys: any, event: any) {
  if (!event.selected) {
    return;
  }
  const selectNode = event.selectedNodes[0];
  itemTableRef.value.crudBinding.search.initialForm = {
    parentId: selectNode.id,
  };
  itemTableRef.value.parentId = selectNode.id;
  itemTableRef.value.setSearchFormData({ form: { parentId: selectNode.id } });
  itemTableRef.value.doRefresh();
}
const modelRef = ref({
  roleId: null,
}) as Record<string, any>;
const [Modal, modalApi] = useVbenModal({
  title: '功能权限',
  class: 'm-assign-resource',
  draggable: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    console.log('itemTableRef.value', itemTableRef.value.selectedRowKeys);
    const data = [...new Set(resIdList.value.concat(checkedKeys.value))];
    api
      .assignResource({ roleId: modelRef.value.roleId, resIds: data })
      .then(() => {
        notification.success({
          message: '权限分配成功',
          duration: 3,
        });
        // modalApi.close();
      });
  },
  onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      return;
    }
    getAllMenusApi().then((ret) => {
      treeData.value = ret;
      expandedKeys.value = ret
        .filter((item: any) => item.parentId === '0')
        .map((item: any) => item.id);

      modelRef.value = modalApi.getData<Record<string, any>>();
      api.getRolePermissions(modelRef.value.roleId).then((ret) => {
        checkedKeys.value = ret.resIdList;
      });
    });
  },
});
</script>

<template>
  <Modal>
    <Page content-class="flex gap-2">
      <Card class="w-5/12">
        <a-tree
          v-model:checked-keys="checkedKeys"
          v-model:expanded-keys="expandedKeys"
          :auto-expand-parent="true"
          :default-expand-all="true"
          :field-names="{ key: 'id', title: 'title' }"
          :tree-data="treeData"
          checkable
          @select="handleSelect"
        />
      </Card>
      <Card class="w-full" title="按钮">
        按钮列表
        <!--      <ResourceButtonTable ref="itemTableRef" />-->
      </Card>
    </Page>
  </Modal>
</template>

<style lang="less">
.m-assign-resource {
  width: 75%;
  height: 75%;
}
</style>
