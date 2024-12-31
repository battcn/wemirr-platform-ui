<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import { EBuilder, type PageSchema } from 'epic-designer';

import * as api from './api';

const props = defineProps<{
  processId: string;
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
  api.RenderFormByProcessInstanceId(procInstId).then((ret) => {
    state.formData = ret.dataJson;
    state.pageSchema = { ...ret.formDesign };
  });
});
</script>
<template>
  <EBuilder
    ref="ebRef"
    :form-data="state.formData"
    :page-schema="state.pageSchema"
  />
</template>
<style lang="less" scoped></style>
