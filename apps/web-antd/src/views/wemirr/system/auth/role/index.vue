<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useFs } from '@fast-crud/fast-crud';

import * as api from './api';
import AssignResource from './assign-resource.vue';
import AssignUser from './assign-user.vue';
import createCrudOptions from './crud';

const [AssignUserModal, userModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: AssignUser,
});
const [AssignUserResourceModal, resourceModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: AssignResource,
});

function assignModal() {
  function userModal(roleId) {
    api.GetUserByRoleId(roleId).then((data) => {
      userModalApi.setData({ roleId, ...data });
      userModalApi.open();
    });
  }

  function resourceModal(roleId) {
    resourceModalApi.setData({ roleId });
    resourceModalApi.open();
  }
  return {
    userModal,
    resourceModal,
  };
}

const assign = assignModal();
const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: { assign, permission: 'sys:role' },
});

const treeData = ref([]);

// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #form_orgList="scope">
        <a-tree
          v-if="scope.form.scopeType === 20"
          v-model:value="scope.form.orgList"
          :field-names="{ title: 'name', key: 'id' }"
          :tree-data="treeData"
          checkable
          search
          title="组织架构"
          toolbar
        />
      </template>
      <template #cell_description="scope">
        <a-tooltip :title="scope.row.description" placement="top">
          {{ scope.row.description }}
        </a-tooltip>
      </template>
    </fs-crud>
    <AssignUserModal />
    <AssignUserResourceModal />
  </fs-page>
</template>
