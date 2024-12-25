<script lang="ts" setup>
import { type Ref } from 'vue';
import { ref } from 'vue';

import { useUi } from '@fast-crud/ui-interface';

import { defHttp } from '#/api/request';
import * as api from '#/views/wemirr/bpm/task/complete/api';

const { ui } = useUi();
const processXmlRef: Ref = ref();
const highlightRef: Ref<any[]> = ref([]);
const dialogShow = ref(false);

const popoverTitle = ref('');
const popoverVisible = ref(false);
const popoverOverlayStyle = ref();
const previewContainerRef = ref();
const popoverContent = `
        <div class="custom-popover-content">
          <p>审批人员: 易炸千釜</p>
          <p>节点状态: 已处理</p>
          <p>开始时间: 2024-08-12 16:12:57</p>
          <p>结束时间: 2024-08-12 16:12:57</p>
          <p>审批耗时: 0秒</p>
        </div>
      `;

async function handleElementClick(element) {
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
    popoverVisible.value = false;
    return;
  }

  const bbox = element.di.bounds;
  if (bbox && previewContainerRef.value) {
    const canvas = element.diagram.get('canvas');
    const zoom = canvas.zoom();

    // 设置弹窗位置
    popoverOverlayStyle.value = {
      position: 'absolute',
      top: `${bbox.y * zoom + 280}px`,
      left: `${bbox.x * zoom}px`,
    };

    popoverVisible.value = true;
  }
}

function openPreview({ procInstId, modelId }) {
  if (procInstId) {
    api.getApprovalDetail(procInstId).then((ret) => {
      processXmlRef.value = ret?.diagramData;
      popoverTitle.value = ret?.diagramName;
      highlightRef.value = ret?.nodeList;
      dialogShow.value = true;
    });
  }
  if (modelId) {
    defHttp.get(`/bpm/process_models/${modelId}`).then((ret) => {
      processXmlRef.value = ret?.diagramData;
      popoverTitle.value = ret?.diagramName;
      dialogShow.value = true;
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
    v-if="dialogShow"
    v-model:[ui.dialog.visible]="dialogShow"
    :title="popoverTitle"
    :width="1300"
    cancel-text="关闭"
  >
    <div ref="previewContainerRef" class="preview-container">
      <div
        v-if="popoverVisible"
        :style="popoverOverlayStyle"
        class="custom-tooltip"
      >
        <div class="tooltip-content" v-html="popoverContent"></div>
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
