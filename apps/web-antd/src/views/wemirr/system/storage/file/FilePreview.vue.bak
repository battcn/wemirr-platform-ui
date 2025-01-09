<script lang="ts" setup>
import { ref } from 'vue';

import VueOfficeDocx from '@vue-office/docx';
import VueOfficeExcel from '@vue-office/excel';
import VueOfficePdf from '@vue-office/pdf';
import { message } from 'ant-design-vue';

const props = defineProps({
  fileInfo: {
    type: Object,
    default: () => ({}),
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:show', 'close']);

/** WPS、Office文件类型 */
const WordTypes = ['doc', 'docx'];
const ExcelTypes = ['xls', 'xlsx'];

const excelConfig = ref({
  xls: false,
  minColLength: 0,
  minRowLength: 0,
  widthOffset: 10,
  heightOffset: 10,
  beforeTransformData: (workbookData: any) => {
    return workbookData;
  },
  transformData: (workbookData: any) => {
    return workbookData;
  },
});

const renderedHandler = () => {
  // message.success('文件加载完成');
};

const errorHandler = () => {
  message.error('文件加载失败');
};

const onClose = () => {
  emit('update:show', false);
  emit('close');
};
</script>

<template>
  <a-modal
    v-model:open="props.show"
    :footer="false"
    :hight="1000"
    :width="1500"
    esc-to-close="esc-to-close"
    title="文件预览"
    @cancel="onClose"
    @close="onClose"
    @ok="onClose"
  >
    <VueOfficePdf
      v-if="fileInfo?.ext === 'pdf'"
      :src="fileInfo?.url"
      style="height: 100vh"
      @error="errorHandler"
      @rendered="renderedHandler"
    />
    <VueOfficeDocx
      v-else-if="WordTypes.includes(fileInfo?.ext || '')"
      :src="fileInfo?.url"
      style="height: 80vh"
      @error="errorHandler"
      @rendered="renderedHandler"
    />
    <VueOfficeExcel
      v-else-if="ExcelTypes.includes(fileInfo?.ext || '')"
      :options="excelConfig"
      :src="fileInfo?.url"
      style="height: 80vh; width: 100%"
      @error="errorHandler"
      @rendered="renderedHandler"
    />
  </a-modal>
</template>
