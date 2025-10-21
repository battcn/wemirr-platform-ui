<script>
import { reactive, ref } from 'vue';

export default {
  name: 'PrintPreview',
  props: {},
  setup() {
    const visible = ref(false);
    const spinning = ref(false);
    const waitShowPrinter = ref(false);
    const width = ref(0);
    const hiprintTemplateRef = ref();
    const printData = reactive({});

    const hideModal = () => {
      visible.value = false;
    };

    const showModal = (hiprintTemplate, printData, preWidth = '210') => {
      visible.value = true;
      spinning.value = true;
      width.value = hiprintTemplate.editingPanel
        ? hiprintTemplate.editingPanel.width
        : preWidth;
      hiprintTemplateRef.value = hiprintTemplate;
      // printData = printData;
      setTimeout(() => {
        $('#preview_content_design').html(hiprintTemplate.getHtml(printData));
        spinning.value = false;
      }, 500);
    };

    const print = () => {
      waitShowPrinter.value = true;
      hiprintTemplateRef.value.print(
        printData,
        {},
        {
          callback: () => {
            console.log('callback');
            waitShowPrinter.value = false;
          },
        },
      );
    };

    const toPdf = () => {
      hiprintTemplateRef.value.toPdf({}, '打印预览');
    };

    return {
      visible,
      spinning,
      waitShowPrinter,
      width,
      hiprintTemplateRef,
      printData,
      hideModal,
      showModal,
      print,
      toPdf,
    };
  },
};
</script>

<template>
  <a-modal
    class="print-preview-modal"
    v-model:open="visible"
    :mask-closable="false"
    @cancel="hideModal"
    :width="`${width}mm`"
  >
    <a-spin :spinning="spinning" style="min-height: 100px">
      <div id="preview_content_design"></div>
    </a-spin>

    <template #footer>
      <!--      <a-button key="close" type="default" @click="hideModal"> 关闭 </a-button>-->
    </template>
  </a-modal>
</template>

<style>
.print-preview-modal {
  .ant-modal-content {
    padding: 20px 0;
  }
}
</style>
