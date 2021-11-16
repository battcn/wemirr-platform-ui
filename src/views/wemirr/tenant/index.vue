<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #cell_name="scope">
      <a-tooltip placement="top" :title="scope.row.name">
        {{ scope.row.name }}
      </a-tooltip>
    </template>
  </fs-crud>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';

  export default defineComponent({
    name: 'TenantForm',
    setup() {
      const crudRef = ref();
      const crudBinding = ref();
      const areaTree = ref([]);
      const { expose } = useExpose({ crudRef, crudBinding });
      const { crudOptions } = createCrudOptions({ expose });
      useCrud({ expose, crudOptions });

      onMounted(() => {
        expose.doRefresh();
      });

      const filter = (inputValue, path) => {
        return path.some(
          (option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
        );
      };
      return {
        filter,
        areaTree,
        crudBinding,
        crudRef,
      };
    },
  });
</script>
