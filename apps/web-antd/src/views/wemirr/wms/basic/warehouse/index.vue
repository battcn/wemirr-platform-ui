<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import createCrudOptions from './crud';
// import { useModal } from "#/components/Modal";
// import BarcodePrintModal from "#/views/wemirr/wms/basic/components/BarcodePrintModal.vue";
// import { useMessage } from "@/hooks/web/useMessage";

// 此处为组件定义
export default defineComponent({
  name: 'WarehousePage',
  // components: { BarcodePrintModal },
  setup() {
    // const [registerPrintModal, { openModal }] = useModal();
    const { crudBinding, crudRef, crudExpose, context } = useFs({
      createCrudOptions,
    });
    // const { createMessage } = useMessage();
    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
    });

    function handleBatchPrint() {
      const codes = context?.selectedRows?.map((x) => x.warehouseCode);
      // if (codes === undefined || codes?.length <= 0) {
      //   createMessage.error("请选择要打印的内容");
      //   return;
      // }
      // openModal(true, {
      //   codes: codes,
      //   isUpdate: true,
      //   showFooter: true,
      // });
    }

    return {
      crudBinding,
      crudRef,
      // registerPrintModal,
      handleBatchPrint,
    };
  },
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_warehouseCode="scope">
        <a-tooltip :title="scope.row.warehouseCode" placement="top">
          {{ scope.row.warehouseCode }}
        </a-tooltip>
      </template>
      <template #cell_warehouseName="scope">
        <a-tooltip :title="scope.row.warehouseName" placement="top">
          {{ scope.row.warehouseName }}
        </a-tooltip>
      </template>
      <template #actionbar-right>
        <fs-button icon="ph:barcode" type="primary" @click="handleBatchPrint">
          批量打印
        </fs-button>
      </template>
    </fs-crud>
    <!--    <BarcodePrintModal @register="registerPrintModal" />-->
  </fs-page>
</template>
