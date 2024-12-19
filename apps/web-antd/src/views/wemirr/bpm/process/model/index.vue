<script>
import { defineComponent, nextTick, onMounted, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';
import { useUi } from '@fast-crud/ui-interface';

import createCrudOptions from './crud';
// import { BasicModal, useModal } from "#/components/Modal";
import * as api from './api';

export default defineComponent({
  name: 'BpmProcessList',
  // components: { BasicModal },
  setup() {
    const { ui } = useUi();
    // const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();
    const bpmnPreviewTitle = ref('');
    const bpmnPreviewDomRef = ref();
    const processXmlRef = ref();
    const highlightRef = ref([]);

    const { crudRef, crudBinding, crudExpose } = useFs({
      createCrudOptions,
      handleView,
    });

    async function handleView(modelId) {
      const data = await api.GetById(modelId);
      bpmnPreviewTitle.value = data?.diagramName;
      // openPreviewModal(true);
      await nextTick(() => {
        processXmlRef.value = data?.diagramData;
      });
    }

    onMounted(() => {
      crudExpose.doRefresh();
    });

    return {
      ui,
      processXmlRef,
      highlightRef,
      bpmnPreviewDomRef,
      bpmnPreviewTitle,
      // registerPreviewModal,
      handleView,
      crudBinding,
      crudRef,
    };
  },
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding" />
    <!--    <BasicModal
      @register="registerPreviewModal"
      v-bind="$attrs"
      :canFullscreen="false"
      :title="bpmnPreviewTitle"
      :showCancelBtn="false"
      :showOkBtn="false"
      :height="680"
      width="70%"
    >
      <fs-bpmn-preview
        v-if="processXmlRef"
        :highlight="highlightRef"
        :xml="processXmlRef"
        style="height: 600px"
      />
    </BasicModal>-->
  </fs-page>
</template>
