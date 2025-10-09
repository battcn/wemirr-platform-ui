<script lang="ts" setup>
import type { PageSchema } from 'epic-designer';

import { onMounted, reactive, ref } from 'vue';

import { EBuilder } from 'epic-designer';

import * as api from './api';

const props = defineProps<{
  formPreview?: {
    formData: {};
    formDesign: {
      schemas: [];
      script: '';
    };
  };
  /**
   * 如果 processId 不为空,则默认会发送请求实时渲染
   */
  processId?: string;
}>();
const ebRef = ref<any>(null);
const state = reactive({
  formData: {},
  pageSchema: ref<PageSchema>({
    schemas: [],
    script: '',
  }),
});
onMounted(() => {
  const procInstId = props.processId;
  if (procInstId) {
    api.getFormPreviewByInstanceId(procInstId).then((ret) => {
      state.formData = ret.formData;
      state.pageSchema = { ...ret.formDesign };
    });
  }
  if (props.formPreview) {
    state.formData = props.formPreview.formData;
    state.pageSchema = { ...props.formPreview.formDesign };
  }
});
</script>
<template>
  <EBuilder
    ref="ebRef"
    :form-data="state.formData"
    :page-schema="state.pageSchema"
    :disabled="true"
  />
</template>
<style lang="less" scoped></style>
