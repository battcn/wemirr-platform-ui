<template>
  <PageWrapper contentClass="flex" contentFullHeight fixedHeight class="bg-white m-4 mr-4">
    <fs-crud ref="crudRef" v-bind="crudBinding" />
  </PageWrapper>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";
import { PageWrapper } from "@/components/Page";

export default defineComponent({
  name: "DictionaryForm",
  components: { PageWrapper },
  setup() {
    // crud组件的ref
    const crudRef = ref();
    // crud 配置的ref
    const crudBinding = ref();
    // 暴露的方法
    const { expose } = useExpose({ crudRef, crudBinding });
    // 你的crud配置
    const { crudOptions } = createCrudOptions({ expose });
    // 初始化crud配置
    useCrud({ expose, crudOptions, permission: "dict:management" });
    // 页面打开后获取列表数据
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
