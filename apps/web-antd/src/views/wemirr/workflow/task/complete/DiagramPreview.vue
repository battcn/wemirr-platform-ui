<script lang="ts" setup>
import { reactive, ref } from 'vue';

import { useAccessStore } from '@vben/stores';

import { useUi } from '@fast-crud/ui-interface';

import {
  GetById,
  GetInstanceById,
} from '#/views/wemirr/workflow/process/model/api';

const url = ref('');
const height = ref('');
height.value = `${document.documentElement.clientHeight - 200}px;`;

const { ui } = useUi();
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
const accessStore = useAccessStore();

function openPreview({ defId, instanceId }: any) {
  if (defId) {
    GetById(defId).then((res) => {
      state.dialogShow = true;
      state.dialogTitle = res.flowName;
      url.value = `${import.meta.env.VITE_GLOB_API_URL}/workflow/warm-flow-ui/index.html?Authorization=Bearer ${accessStore.accessToken}&id=${defId}`;
    });
  }
  if (instanceId) {
    GetInstanceById(instanceId).then((res) => {
      state.dialogShow = true;
      state.dialogTitle = '流程预览';
      url.value = `${import.meta.env.VITE_GLOB_API_URL}/workflow/warm-flow-ui/index.html?Authorization=Bearer ${accessStore.accessToken}&id=${instanceId}&type=FlowChart`;
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
    :is="ui.drawer.name"
    v-if="state.dialogShow"
    v-model:[ui.dialog.visible]="state.dialogShow"
    :title="state.dialogTitle"
    :width="1300"
    style="padding: 10px"
  >
    <div :style="`height:${height}`">
      <iframe :src="url" class="h-full w-full"></iframe>
    </div>
  </component>
</template>

<style scoped></style>
