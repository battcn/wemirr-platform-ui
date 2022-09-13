<template>
  <PageWrapper @back="goBack" :title="title">
    <SkillFullBpmnDesigner
      @change="handleChange"
      :high-margin="254"
      @save="handleSaveOk"
      :dataMethod="urlInfos"
      ref="designer"
    />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { SkillFullBpmnDesigner } from 'skillfull-process-pro-antvue';
  import { ref, onMounted, reactive } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute, useRouter } from 'vue-router';
  // import { getById, insert, update } from '/@/api/modules/process/base/designModel';
  // import { getList } from '/@/api/modules/process/base/processCategory';
  // import { selectPage as selectExpressionPage } from '/@/api/modules/process/base/designExpression';
  // import { selectPage as selectRolePage } from '/@/api/modules/system/rbac/rbacRole';
  // import { selectPage as selectUserPage } from '/@/api/modules/system/rbac/rbacUser';
  // import { selectOrgTreeList } from '/@/api/modules/system/rbac/rbacOrg';
  // import { getById as getHistoryById } from '/@/api/modules/process/base/designModelHistory';
  const designer = ref();
  const route = useRoute();
  const title = ref('模型设计');
  const type = ref('新增模型');
  const router = useRouter();
  const { closeCurrent } = useTabs();
  const modelId = ref(route.query?.modelId as string);
  const isCopy = ref(route.query?.isCopy as string);
  const history = ref(route.query?.history as string);
  async function getCategoryData(params: any) {
    return null; //await getList(params);
  }
  async function getUserPage(params: any) {
    return null; // await selectUserPage(params);
  }
  async function getGroupPage(params: any) {
    return null; // await selectRolePage(params);
  }
  async function getExpressionPage(params: any) {
    return null; // await selectExpressionPage(params);
  }
  async function getOrgTree(params: any) {
    return null; // await selectOrgTreeList(params['type']);
  }
  const urlInfos = reactive({
    categoryMeghod: getCategoryData,
    userPageMeghod: getUserPage,
    groupPageMeghod: getGroupPage,
    expressionPageMeghod: getExpressionPage,
    orgTreeMeghod: getOrgTree,
  });
  function goBack() {
    closeCurrent();
    router.back();
  }
  async function handleDetail() {
    if (modelId.value) {
      let data;
      if (!history.value) {
        // data = await getById(modelId.value);
      } else {
        // data = await getHistoryById(modelId.value);
      }
      type.value = '编辑模型';
      title.value = type.value + (data.diagramNames ? '(' + data.diagramNames + ')' : '');
      designer.value.openBase64Diagram(data.diagramData);
    } else {
      type.value = '新增模型';
      title.value = type.value;
      designer.value.createNewDiagram();
    }
  }
  function handleChange(processInfo: any) {
    if (processInfo) {
      title.value =
        type.value + (processInfo.diagramNames ? '(' + processInfo.diagramNames + ')' : '');
    }
  }
  async function handleSaveOk(processInfo: any) {
    try {
      if (modelId.value && !isCopy.value) {
        await update(processInfo, modelId.value);
      } else {
        await insert(processInfo);
      }
      goBack();
    } catch (e: any) {}
  }
  onMounted(() => {
    handleDetail();
  });
</script>

<style lang="less">
  @import 'bpmn-js-color-picker/colors/color-picker.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  @import 'bpmn-js/dist/assets/bpmn-js.css';
  @import 'bpmn-js/dist/assets/diagram-js.css';
  @import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
  @import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';
  @import 'diagram-js-minimap/assets/diagram-js-minimap.css';
  @import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';
</style>
