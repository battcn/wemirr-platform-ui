<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import AntdGenerateForm from '#/components/FormDesigner/antd/render/AntdGenerateForm.vue';

import * as api from './api';
import { setJsonIntoFrom, WidgetFormItem } from './data';

const props = defineProps<{
  processId: string;
}>();

const state = reactive({
  widgetForm: {
    config: { disabled: true },
    list: [] as undefined | WidgetFormItem[],
  },
});

// 打开Form预览modal时，重新渲染modal
const generateFormRenderKey = ref('');
onMounted(() => {
  const procInstId = props.processId;
  api.RenderFormByProcessInstanceId(procInstId).then((ret) => {
    if (ret.formDesign.formConfig) {
      state.widgetForm.config = ret?.formDesign.formConfig;
      state.widgetForm.config.disabled = true;
      state.widgetForm.list = setJsonIntoFrom(
        ret?.formDesign.formFields,
        ret?.dataJson,
      );
    }
    generateFormRenderKey.value = Date.now().toString();
  });
});
</script>
<template>
  <AntdGenerateForm
    :key="generateFormRenderKey"
    ref="generateFormRef"
    :data="state.widgetForm"
  />
</template>
<style lang="less" scoped>
.result-success {
  background-color: @component-background;

  &__content {
  }
}
</style>
