<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useFs } from '@fast-crud/fast-crud';

import createCrudOptions from './crud';
import DistributionUser from './DistributionUser.vue';

// import DistributionResource from "./DistributionResource.vue";
import * as api from './api';

const [DistributionModal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: DistributionUser,
});

function useDistribution() {
  const checkedKeys = ref();

  function userModal(roleId) {
    // modalApi.open();
    api.GetUserByRoleId(roleId).then((data) => {
      // openBindUser(true, { roleId, ...data });
      modalApi.setData({ roleId, ...data });
      modalApi.open();
    });
  }

  // const [registerBindUser, { openModal: openBindUser }] = useModal();

  // function resourceModal(roleId) {
  // openBindResource(true, roleId);
  // }
  // const [registerBindResource, { openModal: openBindResource }] = useModal();

  return {
    checkedKeys,
    userModal,
    // resourceModal,
    // registerBindUser,
    // registerBindResource,
  };
}

const distribution = useDistribution();
const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: { distribution, permission: 'sys:role' },
});

const treeData = ref([]);

async function initOrgList() {
  // await api.InitOrgList().then((data) => {
  //   treeData.value = data;
  // });
}

// 页面打开后获取列表数据
onMounted(() => {
  initOrgList();
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
    <!--    <DistributionModal/>-->
    <DistributionModal />
    <!--        <distribution-resource @register="registerBindResource" />-->
  </fs-page>
</template>
