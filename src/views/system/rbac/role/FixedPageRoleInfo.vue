<template>
  <PageWrapper @back="goBack" :title="title || '申请详情'" contentFullHeight>
    <template #extra>
      <a-button preIcon="ant-design:close-outlined" @click="goBack" size="middle"> 取消 </a-button>
    </template>
    <Spin tip="加载中" :spinning="data.pageLoading" size="large">
      <a-card style="width: 100%; min-height: 73vh">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="menu-auth" tab="功能权限">
            <div style="margin-bottom: 5px">
              <a-checkbox v-model:checked="data.selectAll">全选/全不选</a-checkbox>
              <a-checkbox v-model:checked="data.linkage">父子联动</a-checkbox>
            </div>
            <MenuAuth
              v-model:value="data.authData.menuIds"
              :selectAll="data.selectAll"
              :linkage="data.linkage"
              style="max-height: 60vh; overflow-y: auto"
            />
          </a-tab-pane>
          <a-tab-pane key="data-auth" tab="数据权限" class="data-auth">
            <div style="width: 50%">
              <a-radio-group v-model:value="data.authData.dataAuthType" button-style="solid">
                <a-radio-button :value="1">全部</a-radio-button>
                <a-radio-button :value="2">当前机构</a-radio-button>
                <a-radio-button :value="3">当前机构及以下</a-radio-button>
                <a-radio-button :value="4">机构自定义</a-radio-button>
                <!-- <a-radio-button  :value="5">当前区域</a-radio-button>
              <a-radio-button  :value="6">当前区域及以下</a-radio-button> -->
                <!-- <a-radio-button  :value="7">区域自定义</a-radio-button> -->
                <a-radio-button :value="8">仅自己</a-radio-button>
              </a-radio-group>
              <a-card style="width: 80%; margin-top: 20px" v-show="data.authData.dataAuthType == 4">
                <OrgTree :value="data.authData.customDataAuthData" @change="handleDataAuthChange" />
              </a-card>
            </div>
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
  import { Spin } from 'ant-design-vue';
  import MenuAuth from './MenuAuth.vue';
  import OrgTree from './OrgTree.vue';
  import { PageWrapper } from '/@/components/Page';
  import { RbacResourceDto } from '/@/api/modules/system/rbac/model/rbacResourceModel';
  import { getById as getRoleById, updateAuth } from '/@/api/modules/system/rbac/rbacRole';
  import { ref, reactive, onMounted } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute, useRouter } from 'vue-router';
  const route = useRoute();
  const router = useRouter();
  const params = reactive(route.query as any);
  const activeKey = ref('menu-auth');
  const data = reactive({
    pageLoading: false,
    submitLoading: false,
    resource: {} as RbacResourceDto,
    selectAll: false,
    linkage: false,
    selectApiInfos: [] as any[],
    authData: {
      menuIds: [] as string[],
      apiIds: [] as string[],
      dataAuthType: 8,
      customDataAuthData: [] as string[],
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
      if (data.authData.dataAuthType != 4) {
        data.authData.customDataAuthData = [];
      }
      await updateAuth(data.authData, params.roleId);
      goBack();
    } finally {
      data.submitLoading = false;
    }
  }
  function handleDataAuthChange(keys: string[]) {
    data.authData.customDataAuthData = keys;
  }
  // function handleMenuChange(menuIds: string[]) {
  //   data.authData.menuIds = menuIds;
  // }
  async function handleDetail() {
    try {
      data.pageLoading = true;
      const roleInfo = await getRoleById(params.roleId);
      data.authData = {
        menuIds: roleInfo.menuIds,
        apiIds: roleInfo.apiIds,
        dataAuthType: roleInfo.dataAuthType || 8,
        customDataAuthData: roleInfo.customDataAuthData || [],
      };
      data.selectApiInfos = roleInfo.selectApiInfos || [];
    } finally {
      data.pageLoading = false;
    }
  }
  onMounted(() => {
    handleDetail();
  });
</script>

<style lang="less">
  .data-auth {
    margin: 10px;
    margin-left: 30px;
  }
</style>
