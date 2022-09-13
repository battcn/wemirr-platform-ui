<template>
  <PageWrapper @back="goBack" :title="title || '申请详情'" contentFullHeight>
    <template #extra>
      <a-button preIcon="ant-design:close-outlined" @click="goBack" size="middle"> 取消 </a-button>
    </template>
    <Spin tip="加载中" :spinning="data.pageLoading" size="large">
      <a-card style="width: 100%; min-height: 73vh">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="base-info" tab="基本信息">
            <BasicForm @register="registerForm" style="padding-right: 10px">
              <template #areaCode="{ model, field }">
                <TreeSelect
                  :treeDefaultExpandedKeys="data.treeDefaultExpandedKeys"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  v-model:value="model[field]"
                  placeholder="请选择所属区域"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="data.areaData"
                  :load-data="onLoadData"
                  :fieldNames="{ children: 'children', label: 'areaName', value: 'areaId' }"
                />
              </template>
            </BasicForm>
          </a-tab-pane>
          <a-tab-pane key="menu-auth" tab="功能权限">
            <div style="margin-bottom: 5px">
              <a-checkbox v-model:checked="data.selectAll">全选/全不选</a-checkbox>
              <a-checkbox v-model:checked="data.linkage">父子联动</a-checkbox>
            </div>
            <MenuAuth
              v-model:value="data.authData.menuIds"
              :selectAll="data.selectAll"
              @change="handleMenuChange"
              :linkage="data.linkage"
              style="max-height: 60vh; overflow-y: auto"
            />
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
  import MenuAuth from './MenuAuth.vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './org.data';
  import { insert, update, getById } from '/@/api/modules/system/rbac/rbacOrg';
  import { Spin, TreeSelect } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { getList } from '/@/api/modules/system/common/commonArea';
  import { CommonAreaTreeDto } from '/@/api/modules/system/common/model/commonAreaModel';
  import { ref, reactive, onMounted } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute, useRouter } from 'vue-router';
  const route = useRoute();
  const params = reactive(route.query as any);
  const router = useRouter();
  const activeKey = ref('base-info');
  const data = reactive({
    pageLoading: false,
    treeDefaultExpandedKeys: [] as string[],
    areaData: [] as CommonAreaTreeDto[],
    submitLoading: false,
    selectAll: false,
    linkage: false,
    selectApiInfos: [] as any[],
    authData: {
      menuIds: [] as string[],
      apiIds: [] as string[],
    },
  });
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 120,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });
  const { closeCurrent } = useTabs();
  const title = ref('新增机构');
  function goBack() {
    closeCurrent();
    router.back();
  }
  function handleMenuChange(menuIds: string[]) {
    data.authData.menuIds = menuIds;
  }
  async function handleSubmit() {
    try {
      data.submitLoading = true;
      const values = await validate();
      values.orgMenuIds = data.authData.menuIds;
      values.orgResourceIds = data.authData.apiIds;
      if (params.orgId) {
        await update(values, params.orgId);
      } else {
        await insert(values);
      }
      goBack();
    } finally {
      data.submitLoading = false;
    }
  }
  async function initAreaData(activateAreaId?: string) {
    const result = await getList('', activateAreaId);
    data.areaData = result;
  }
  function onLoadData(treeNode: any) {
    return new Promise((resolve) => {
      const { areaId } = treeNode.dataRef;
      getList(areaId).then((res) => {
        updateNodeByKey(areaId, data.areaData, res);
        resolve(true);
      });
    });
  }
  function updateNodeByKey(areaId: string, areaData: any[], updateData: any[]) {
    var length = areaData.length;
    for (var index = 0; index < length; index++) {
      const element = areaData[index];
      const children = element['children'];
      if (element['areaId'] == areaId) {
        element.children = updateData;
      } else if (children && children.length) {
        updateNodeByKey(areaId, children, updateData);
      }
    }
  }
  async function handleDetail() {
    resetFields();
    data.treeDefaultExpandedKeys = [];
    data.selectApiInfos = [];
    data.authData.menuIds = [];
    data.authData.apiIds = [];
    if (params.orgId) {
      title.value = '编辑机构';
      const result = await getById(params.orgId);
      await initAreaData(result.areaCode);
      data.selectApiInfos = result.orgResourceInfos || [];
      data.authData.menuIds = result.orgMenuIds || [];
      data.authData.apiIds = result.orgResourceIds || [];
      if (result.areaCode) {
        data.treeDefaultExpandedKeys.push(result.areaCode);
      }
      setFieldsValue(result);
    } else {
      await initAreaData();
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
