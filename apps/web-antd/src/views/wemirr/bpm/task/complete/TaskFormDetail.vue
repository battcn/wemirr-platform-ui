<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
// import * as api from './api';
import type { WidgetFormItem } from './data';

const props = defineProps<{
  processId: string;
}>();

const state = reactive({
  widgetForm: {
    config: { disabled: true },
    list: [] as undefined | WidgetFormItem[],
  },
});
onMounted(() => {
  const procInstId = props.processId;
});
</script>
<template>
  <div>正在开发中......</div>
</template>
<style lang="less" scoped></style>
