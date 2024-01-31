<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_rootDir="scope">
        <a-tooltip placement="top" :title="scope.row.rootDir">
          {{ scope.row.rootDir }}
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useFs } from "@fast-crud/fast-crud";
import { useUserStore } from "@/store/modules/user";

export default defineComponent({
  name: "GenerateCodePageList",
  setup() {
    const userStore = useUserStore();
    const { crudRef, crudBinding, crudExpose } = useFs({ createCrudOptions, userStore });
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
