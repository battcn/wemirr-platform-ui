<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding" />
  </fs-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useFs } from "@fast-crud/fast-crud";

export default defineComponent({
  name: "DictItemTable",
  setup() {
    const { crudRef, crudBinding, crudExpose } = useFs({
      createCrudOptions,
      context: { permission: "sys:dict" },
    });
    // 页面打开后获取列表数据
    onMounted(() => {});

    return {
      crudBinding,
      crudRef,
      setSearchFormData: crudExpose.setSearchFormData,
      doRefresh: crudExpose.doRefresh,
    };
  },
});
</script>
