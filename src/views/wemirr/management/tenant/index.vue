<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #cell_name="scope">
      <a-tooltip placement="top" :title="scope.row.name">
        {{ scope.row.name }}
      </a-tooltip>
    </template>
<!--    <template #form_area="scope">
      <a-cascader
        v-model:value="scope.form.area"
        :options="areaTree"
        :show-search="{ filter }"
        placeholder="请选择地址"
        change-on-select
      />
    </template>-->
  </fs-crud>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  import { getAreaTree } from '/@/api/sys/area';

  export default defineComponent({
    name: 'TenantForm',
    setup() {
      const crudRef = ref();
      const crudBinding = ref();
      const { expose } = useExpose({ crudRef, crudBinding });
      const { crudOptions } = createCrudOptions({ expose });
      useCrud({ expose, crudOptions });
      const areaTree = ref([]);

      onMounted(() => {
        getAreaTree().then((data) => {
          areaTree.value = data;
        });
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
