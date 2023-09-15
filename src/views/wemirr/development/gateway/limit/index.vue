<template>
  <fs-page className="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding" />
  </fs-page>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";

export default defineComponent({
  name: "GatewayLimitPageList",
  setup() {
    const { crudRef, crudBinding, crudExpose } = useFs({ createCrudOptions, context: {} });
    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
    });
    return {
      crudBinding,
      crudRef,
    };
  },
});
</script>
