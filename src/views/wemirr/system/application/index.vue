<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding" />
  </fs-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";

export default defineComponent({
  name: "ApplicationForm",
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
