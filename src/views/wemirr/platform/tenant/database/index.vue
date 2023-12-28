<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_url="scope">
        <a-tooltip placement="leftTop" :title="scope.row.url">
          {{ scope.row.url }}
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";

export default defineComponent({
  name: "DatabaseForm",
  setup() {
    const crudRef = ref();
    const crudBinding = ref();
    const areaTree = ref([]);
    const { expose } = useExpose({ crudRef, crudBinding });
    const { crudOptions } = createCrudOptions({ expose, areaTree });
    useCrud({ expose, crudOptions });

    onMounted(() => {
      expose.doRefresh();
    });

    const filter = (inputValue, path) => {
      return path.some(
        (option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
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
