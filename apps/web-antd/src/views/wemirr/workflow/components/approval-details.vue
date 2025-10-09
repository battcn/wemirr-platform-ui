<!--
审批详情
动态渲染要显示的内容 需要再flowDescripionsMap先定义好组件
-->
<script setup lang="ts">
import type { FlowInfoResponse } from '#/api/workflow/instance/model';
import type { TaskInfo } from '#/api/workflow/task/model';

import { Divider } from 'ant-design-vue';

import TaskFormDetail from '#/views/wemirr/workflow/task/complete/TaskFormDetail.vue';

import { ApprovalTimeline } from '.';
// import { flowComponentsMap } from '../register';

defineOptions({
  name: 'ApprovalDetails',
  inheritAttrs: false,
});

defineProps<{
  currentFlowInfo: FlowInfoResponse;
  iframeHeight: number;
  iframeLoaded: boolean;
  task: TaskInfo;
}>();
</script>

<template>
  <div>
    <!--
     动态渲染要显示的内容 需要再flowDescripionsMap先定义好组件
     business-id为业务ID 必传


    -->
    <div>
      <TaskFormDetail :form-preview="currentFlowInfo.formPreview" />
    </div>

    <!--    <component
      :is="flowComponentsMap[task.formPath as FlowComponentsMapMapKey]"
      :business-id="task.businessId"
    />-->
    <Divider />
    <ApprovalTimeline :list="currentFlowInfo.taskList" />
  </div>
</template>
