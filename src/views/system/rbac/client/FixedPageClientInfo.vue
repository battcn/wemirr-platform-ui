<template>
  <PageWrapper @back="goBack" :title="title || '申请详情'" contentFullHeight>
    <template #extra>
      <a-button preIcon="ant-design:close-outlined" @click="goBack" size="middle"> 取消 </a-button>
    </template>
    <Spin tip="加载中" :spinning="data.pageLoading" size="large">
      <a-card style="width: 100%; min-height: 73vh">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="role-auth" tab="授权角色">
            <a-row type="flex" justify="start">
              <a-col :span="18">
                <RoleList
                  :roleInfos="data.roleInfos"
                  v-model:value="data.authData.roleIds"
                  @change="handleRoleChange"
                />
              </a-col>
              <a-col :span="6" style="max-height: 60vh; overflow-y: auto">
                <div>
                  <div
                    style="
                      font-size: 18px;
                      font-weight: 500;
                      line-height: 26px;
                      color: #000000d9;
                      width: 100%;
                      border-bottom: 1px solid #d9d9d9;
                      margin-bottom: 3px;
                    "
                    >已选择：</div
                  >
                  <template v-if="data.roleInfos && data.roleInfos">
                    <Popover
                      placement="bottomRight"
                      v-for="item in data.roleInfos"
                      :key="item.roleId"
                    >
                      <template #content>
                        <div>
                          {{ item.roleName }}
                        </div>
                        <div>
                          {{ item.roleCode }}
                        </div>
                      </template>
                      <a-tag
                        closable
                        color="#108ee9"
                        v-if="item.roleName && item.roleName.length > 4"
                        style="margin-bottom: 4px; cursor: pointer"
                        @close="handleCloseRole(item.roleId)"
                      >
                        {{ `${item.roleName.slice(0, 4)}...` }}
                      </a-tag>
                      <a-tag
                        closable
                        v-else
                        color="#108ee9"
                        style="margin-bottom: 4px; cursor: pointer"
                        @close="handleCloseRole(item.roleId)"
                      >
                        {{ `${item.roleName || '---'}` }}
                      </a-tag>
                    </Popover>
                  </template>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </Spin>
    <template #rightFooter>
      <a-button
        type="primary"
        style="margin-right: 10px"
        :loading="data.submitLoading"
        :preIcon="data.submitLoading ? '' : 'ant-design:form-outlined'"
        @click="handleSubmit"
        >确认</a-button
      >
      <a-button preIcon="ant-design:close-outlined" @click="goBack" size="middle"> 取消 </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Spin, Popover } from 'ant-design-vue';
  import RoleList from './RoleList.vue';
  import { PageWrapper } from '/@/components/Page';
  import { RbacResourceDto } from '/@/api/modules/system/rbac/model/rbacResourceModel';
  import { getById, updateAuth } from '/@/api/modules/system/rbac/rbacClientDetails';
  import { ref, reactive, onMounted } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute, useRouter } from 'vue-router';
  const route = useRoute();
  const router = useRouter();
  const params = reactive(route.query as any);
  const activeKey = ref('role-auth');
  const data = reactive({
    pageLoading: false,
    submitLoading: false,
    resource: {} as RbacResourceDto,
    selectAll: false,
    linkage: false,
    clientResourceApiInfos: [] as any[],
    roleInfos: [] as any[],
    authData: {
      clientResourceApiIds: [] as string[],
      roleIds: [] as string[],
    },
  });
  const { closeCurrent } = useTabs();
  const title = ref('角色授权');
  function goBack() {
    closeCurrent();
    router.back();
  }
  async function handleSubmit() {
    try {
      data.submitLoading = true;
      await updateAuth(data.authData, params.clientDetailId);
      goBack();
    } finally {
      data.submitLoading = false;
    }
  }
  function handleRoleChange({ selectedRows, selectedRowKeys }) {
    data.roleInfos = selectedRows;
    data.authData.roleIds = selectedRowKeys;
  }
  function handleCloseRole(roleId: string) {
    let findIndex = data.roleInfos.findIndex((val) => val.roleId == roleId);
    if (findIndex != -1) {
      data.roleInfos.splice(findIndex, 1);
    }
    findIndex = data.authData.roleIds.findIndex((val) => val == roleId);
    if (findIndex != -1) {
      data.authData.roleIds.splice(findIndex, 1);
    }
  }

  async function handleDetail() {
    try {
      data.pageLoading = true;
      const clientInfo = await getById(params.clientDetailId);
      data.authData = {
        clientResourceApiIds: clientInfo.clientResourceApiIds,
        roleIds: clientInfo.roleIds,
      };
      data.clientResourceApiInfos = clientInfo.clientResourceApiInfos || [];
      data.roleInfos = clientInfo.roleInfos || [];
    } finally {
      data.pageLoading = false;
    }
  }
  onMounted(() => {
    handleDetail();
  });
</script>

<style lang="less">
  .skillfull-instance-preview {
    background-color: @component-background !important;
  }

  .skillfull-instance-preview-content-diagram {
    overflow-y: hidden !important;
  }
</style>
