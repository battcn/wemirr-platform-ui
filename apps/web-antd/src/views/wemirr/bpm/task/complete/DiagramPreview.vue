<script lang="ts" setup>
import type { Ref } from 'vue';

import { reactive, ref } from 'vue';

import { useUi } from '@fast-crud/ui-interface';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';
import * as api from '#/views/wemirr/bpm/task/complete/api';

const { ui } = useUi();
const processXmlRef: Ref = ref();
const highlightRef: Ref<any[]> = ref([]);
const previewContainerRef = ref();
const componentRef = ref();
const state = reactive({
  processStartTime: '',
  dialogTitle: '',
  dialogShow: false,
  commentList: [
    { taskDefinitionKey: '', approverName: '', approverTime: '', remark: '' },
  ],
  popoverContent: '',
  popover: {
    visible: false,
    overlayStyle: {
      left: '',
      top: '',
    },
  },
});

async function handleElementClick(element: any) {
  // TODO 存在问题， 不知道为什么拿不到具体坐标去弹
  // 忽略开始节点、结束节点和连线的点击
  if (
    !element ||
    !element.diagram ||
    element.type === 'bpmn:StartEvent' ||
    element.type === 'bpmn:Process' ||
    element.type === 'bpmn:EndEvent' ||
    element.type === 'bpmn:ExclusiveGateway' ||
    element.type === 'bpmn:SequenceFlow'
  ) {
    // popoverVisible.value = false;
    state.popover.visible = false;
    return;
  }
  const bbox = element.di.bounds;
  if (bbox && previewContainerRef.value) {
    // 设置弹窗位置
    state.popover.overlayStyle.top = `${bbox.y + bbox.height + 130}px`;
    if (bbox.x < 300) {
      state.popover.overlayStyle.left = `${bbox.x + bbox.width + 140}px`;
    } else if (bbox.x < 550) {
      state.popover.overlayStyle.left = `${bbox.x + bbox.width + 50}px`;
    } else {
      state.popover.overlayStyle.left = `${bbox.x + bbox.width}px`;
    }
    const comment = state.commentList.find(
      (item) => item.taskDefinitionKey === element.id,
    );
    const startTime = dayjs(state?.processStartTime);
    const endTime = dayjs(comment?.approverTime);
    const duration = endTime.diff(startTime, 'second');
    state.popoverContent = comment?.approverName
      ? `
            <div class="custom-popover-content">
              <p>审批人员: ${comment.approverName}</p>
              <p>开始时间: ${startTime.format('YYYY-MM-DD HH:mm:ss')}</p>
              <p>结束时间: ${endTime.format('YYYY-MM-DD HH:mm:ss')}</p>
              <p>审批耗时: ${duration} 秒</p>
            </div>
          `
      : `
            <div class="custom-popover-content">
              <p>开始时间: ${startTime.format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          `;
    state.popover.visible = true;
  }
}

function openPreview({ procInstId, modelId }: any) {
  if (procInstId) {
    api.getInstanceDetailByTaskId(procInstId).then((ret) => {
      state.dialogTitle = ret?.diagramName;
      state.commentList = ret?.commentList;
      state.processStartTime = ret?.processStartTime;
      state.dialogShow = true;
      highlightRef.value = ret?.nodeList;
      processXmlRef.value = ret?.diagramData;
    });
  }
  if (modelId) {
    defHttp.get(`/bpm/process-models/${modelId}`).then((ret) => {
      state.dialogTitle = ret?.diagramName;
      state.processStartTime = ret?.processStartTime;
      state.dialogShow = true;
      processXmlRef.value = ret?.diagramData;
    });
  }
}
defineExpose({
  openPreview,
});
</script>

<template>
  <component
    ref="componentRef"
    :is="ui.dialog.name"
    v-if="state.dialogShow"
    v-model:[ui.dialog.visible]="state.dialogShow"
    :title="state.dialogTitle"
    :width="1300"
    cancel-text="关闭"
  >
    <fs-bpmn-preview
      v-if="processXmlRef"
      :highlight="highlightRef"
      :on-element-click="handleElementClick"
      :xml="processXmlRef"
      style="height: 600px"
    />
    <div ref="previewContainerRef" class="preview-container">
      <div
        v-if="state.popover.visible"
        :style="state.popover.overlayStyle"
        class="custom-tooltip"
      >
        <div class="tooltip-content" v-html="state.popoverContent"></div>
      </div>
    </div>
  </component>
</template>

<style scoped>
.custom-tooltip {
  position: absolute;
  z-index: 1000;
  background: white;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 8px 12px;
  max-width: 300px;
  transform: translateY(-50%);
}

.tooltip-content {
  font-size: 14px;
  line-height: 1.5;
}
</style>
