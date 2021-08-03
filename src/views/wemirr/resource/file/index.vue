<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #cell_originName="scope">
      <a-tooltip placement="topLeft" :title="scope.row.originName">
        {{ scope.row.originName }}
      </a-tooltip>
    </template>
    <template #cell_targetName="scope">
      <a-tooltip placement="topLeft" :title="scope.row.targetName">
        {{ scope.row.targetName }}
      </a-tooltip>
    </template>
    <template #cell_ip="scope">
      <a-tooltip placement="topLeft" :title="scope.row.ip">
        {{ scope.row.ip }}
      </a-tooltip>
    </template>
    <template #cell_location="scope">
      <a-tooltip placement="topLeft" :title="scope.row.location">
        {{ scope.row.location }}
      </a-tooltip>
    </template>
  </fs-crud>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';

  export default defineComponent({
    name: 'FileForm',
    setup() {
      const crudRef = ref();
      const crudBinding = ref();
      const { expose } = useExpose({ crudRef, crudBinding });
      const { crudOptions } = createCrudOptions({ expose });
      useCrud({ expose, crudOptions });
      onMounted(() => {
        expose.doRefresh();
      });
      return {
        crudBinding,
        crudRef,
      };
    },
  });
</script>
