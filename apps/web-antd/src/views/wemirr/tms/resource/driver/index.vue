<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import createCrudOptions from './crud';
//
// function useLogRef() {
//   function openLogModal(taskId) {
//     openBindLog(true, taskId);
//   }
//
//   const [registerBindLog, { openModal: openBindLog }] = useModal();
//   return {
//     openLogModal,
//     registerBindLog,
//   };
// }

export default defineComponent({
  name: 'TmsDriverList',
  setup() {
    // const logRef = useLogRef();
    const { crudBinding, crudRef, crudExpose } = useFs({
      createCrudOptions,
      context: {},
    });
    onMounted(() => {
      crudExpose.doRefresh();
    });
    return {
      // ...logRef,
      crudBinding,
      crudRef,
    };
  },
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_name="scope">
        <a-tooltip :title="scope.row.name" placement="topLeft">
          {{ scope.row.name }}
        </a-tooltip>
      </template>
      <template #cell_description="scope">
        <a-tooltip :title="scope.row.description" placement="topLeft">
          {{ scope.row.description }}
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>
