<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <OrgTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <div class="w-3/4 xl:w-4/5 info-parent">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="user-info" tab="用户信息">
          <UserInfo :orgId="selectOrgId" :orgName="selectOrgName" />
        </a-tab-pane>
        <a-tab-pane key="base-info" tab="基本信息" v-if="selectOrgId">基本信息</a-tab-pane>
        <a-tab-pane key="org-role" tab="机构角色" v-if="selectOrgId">
          <RoleInfo :orgId="selectOrgId" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { getById } from '/@/api/modules/system/rbac/rbacOrg';
  import OrgTree from './OrgTree.vue';
  import RoleInfo from './RoleInfo.vue';
  import UserInfo from './UserInfo.vue';
  const activeKey = ref('user-info');
  const selectOrgId = ref('');
  const selectOrgName = ref('');
  async function handleSelect(orgId) {
    if (!orgId) {
      selectOrgId.value = '';
      selectOrgName.value = '';
    } else {
      selectOrgId.value = orgId;
      const orgInfo = await getById(orgId);
      selectOrgName.value = orgInfo.orgName;
    }
  }
</script>

<style lang="less">
  .info-parent {
    margin: 16px;
    padding: 16px;
    background-color: @component-background;

    .vben-basic-table-form-container {
      padding: 0px;
    }
  }
</style>
