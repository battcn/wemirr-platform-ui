<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { useColumns } from '@fast-crud/fast-crud';

import * as api from './api';
import createApprovalOptions from './approval';

// const { closeCurrent } = useTabs();
const router = useRouter();
const approvalHistoryRef = ref();
const title = ref();
const procInstId = router.currentRoute.value.query.procInstId;
const taskId = router.currentRoute.value.query.taskId;
const type = router.currentRoute.value.query.type;
const shotApprovalButton = ref();
const highlightRef = ref([]);
const processXmlRef = ref();
const activeKey = ref('diagram');

function goBack() {
  // closeCurrent();
  router.push('/bpm/task/list');
}

onMounted(() => {
  api.getApprovalDetail(procInstId).then((ret) => {
    title.value = ret?.startTitle;
    processXmlRef.value = ret?.diagramData;
  });
  shotApprovalButton.value = type === 'complete';
});

function handleChangeTag(key: string) {
  activeKey.value = key;
}

function createFormOptions() {
  const { buildFormOptions } = useColumns();
  const { crudOptions } = createApprovalOptions({ taskId, shotApprovalButton });
  return buildFormOptions(crudOptions);
}

const formWrapperRef = ref();
const formWrapperOptions = ref();

function openFormWrapper() {
  formWrapperOptions.value = createFormOptions();
  formWrapperOptions.value.title = title.value;
  formWrapperRef.value.open(formWrapperOptions.value);
}
</script>

<template>
  <Page :title="title" @back="goBack">
    <!--    <div class="bpm-task-complete-tabs">
      <Tabs
        v-model:active-key="activeKey"
        style="padding: 10px"
        @change="handleChangeTag"
      >
        <TabPane key="diagram" tab="流程图" />
        <TabPane key="taskDetail" tab="审批表单" />
        <TabPane key="approvalNode" tab="审批意见" />
        <template #rightExtra>
          <a-button
            v-show="shotApprovalButton"
            type="primary"
            @click="openFormWrapper"
          >
            <template #icon>
              <CheckOutlined />
            </template>
            审批
          </a-button>
          <fs-form-wrapper ref="formWrapperRef" v-bind="formWrapperOptions" />
        </template>
      </Tabs>
      <div v-show="activeKey === 'taskDetail'" style="padding: 5px 30px">
        <TaskDetailModal />
      </div>
      <div v-show="activeKey === 'diagram'">
        <fs-bpmn-preview
          v-if="processXmlRef"
          :highlight="highlightRef"
          :xml="processXmlRef"
          style="height: 600px"
        />
      </div>
      <div v-show="activeKey === 'approvalNode'">
        <ApprovalHistory ref="approvalHistoryRef" />
      </div>
    </div>-->
  </Page>
</template>

<style lang="less" scoped>
.vben-page-wrapper-content > .bpm-task-complete-tabs {
  background-color: #fff;
}
</style>
