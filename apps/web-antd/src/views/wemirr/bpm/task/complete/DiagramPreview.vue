<script lang="ts" setup>
import { nextTick, Ref, ref } from 'vue';

import * as api from '@/views/wemirr/bpm/task/complete/api';
import { useUi } from '@fast-crud/ui-interface';

const { ui } = useUi();
const processXmlRef: Ref = ref();
const highlightRef: Ref<any[]> = ref([]);
const dialogShow = ref(false);

const popoverVisible = ref(false);
const popoverOverlayStyle = ref();
const popoverPosition = ref({ y: 0, x: 0 });
const popoverContent = `
        <div class="custom-popover-content">
          <p>审批人员: 易炸千釜</p>
          <p>节点状态: 已处理</p>
          <p>开始时间: 2024-08-12 16:12:57</p>
          <p>结束时间: 2024-08-12 16:12:57</p>
          <p>审批耗时: 0秒</p>
        </div>
      `;

function handleElementClick(element) {
  // 希望触发
  console.log('处理点击事件:', element);
  // 设置弹窗内容
  // popoverContent.value = approvalData
  // 获取节点的位置以设置弹窗的位置
  const bbox = element.di.bounds;
  popoverPosition.value = {
    x: bbox.x + bbox.width / 2 + 360,
    y: bbox.y + bbox.height / 2,
  };
  // 设置弹窗内容
  // popoverContent = approvalData
  // this.popoverVisible = true
  updatePopoverPosition();
  popoverVisible.value = true;
}

const updatePopoverPosition = async () => {
  // 等待 DOM 更新完成
  await nextTick();
  // 计算并更新弹出层的位置
  popoverOverlayStyle.value = {
    top: `${popoverPosition.value.y}px`,
    left: `${popoverPosition.value.x}px`, // 根据需要调整
  };
};
function openPreview(procInstId: any) {
  api.CurrentApprovalDetail(procInstId).then((ret) => {
    processXmlRef.value = ret?.diagramData;
    highlightRef.value = ret?.nodeList;
    dialogShow.value = true;
  });
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
    :width="1200"
    title="预览"
  >
    <fs-bpmn-preview
      v-if="processXmlRef"
      :highlight="highlightRef"
      :on-element-click="handleElementClick"
      :xml="processXmlRef"
      style="height: 600px"
    />
  </component>
  <a-popover
    v-if="popoverVisible"
    :open="popoverVisible"
    :overlay-style="popoverOverlayStyle"
    trigger="hover"
  >
    <!-- 弹框内容区域 -->
    <template #content>
      <div v-html="popoverContent"></div>
    </template>
  </a-popover>
</template>
