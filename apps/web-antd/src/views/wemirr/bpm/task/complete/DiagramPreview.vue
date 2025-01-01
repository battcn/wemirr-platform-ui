<script lang="ts" setup>
import { reactive, type Ref } from 'vue';
import { ref } from 'vue';

import { useUi } from '@fast-crud/ui-interface';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';
import * as api from '#/views/wemirr/bpm/task/complete/api';

const { ui } = useUi();
const processXmlRef: Ref = ref();
const highlightRef: Ref<any[]> = ref([]);
const previewContainerRef = ref();

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
    overlayStyle: {},
  },
});

async function handleElementClick(element: any) {
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
    const canvas = element.diagram.get('canvas');
    const zoom = canvas.zoom();
    // 设置弹窗位置
    state.popover.overlayStyle = {
      position: 'absolute',
      top: `${bbox.y * zoom + 330}px`,
      left: `${bbox.x * zoom + 100}px`,
    };
    const comment = state.commentList.find(
      (item) => item.taskDefinitionKey === element.id,
    );
    const startTime = dayjs(state?.processStartTime);
    const endTime = dayjs(comment?.approverTime);
    const duration = endTime.diff(startTime, 'second');
    state.popoverContent = `
            <div class="custom-popover-content">
              <p>审批人员: ${comment?.approverName}</p>
              <p>开始时间: ${startTime.format('YYYY-MM-DD HH:mm:ss')}</p>
              <p>结束时间: ${endTime.format('YYYY-MM-DD HH:mm:ss')}</p>
              <p>审批耗时: ${duration} 秒</p>
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
    :is="ui.dialog.name"
    v-if="state.dialogShow"
    v-model:[ui.dialog.visible]="state.dialogShow"
    :title="state.dialogTitle"
    :width="1300"
    cancel-text="关闭"
  >
    <div ref="previewContainerRef" class="preview-container">
      <div
        v-if="state.popover.visible"
        :style="state.popover.overlayStyle"
        class="custom-tooltip"
      >
        <div class="tooltip-content" v-html="state.popoverContent"></div>
      </div>

      <fs-bpmn-preview
        v-if="processXmlRef"
        :highlight="highlightRef"
        :on-element-click="handleElementClick"
        :xml="processXmlRef"
        style="height: 600px"
      />
    </div>
  </component>
</template>

<style scoped>
.preview-container {
  position: relative;
  height: 600px;
  overflow: hidden;
}

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

.custom-tooltip::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid white;
}

.tooltip-content {
  font-size: 14px;
  line-height: 1.5;
}
</style>
