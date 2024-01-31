<template>
  <div>
    <div style="margin-top: 6px">{{ modelValue }}</div>
    <div style="height: 400px">
      <fs-crud ref="crudRef" v-bind="crudBinding" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud, useFs } from "@fast-crud/fast-crud";

export default defineComponent({
  name: "TenantDictItemPage",
  props: {
    modelValue: {},
  },
  emits: ["update:modelValue"],
  setup(props, ctx) {
    // // 暴露的方法
    // const { expose } = useExpose({ crudRef, crudBinding });
    // // 你的crud配置
    // const { crudOptions } = createCrudOptions({ expose, props, ctx });
    // // 初始化crud配置
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    // const { resetCrudOptions } = useCrud({ expose, crudOptions });

    const { crudRef, crudBinding, crudExpose } = useFs({
      createCrudOptions,
      props,
    });

    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
    });

    //你的业务代码
    watch(
      () => {
        return props.modelValue;
      },
      (value) => {
        console.log("modelValue changed", value);
      },
    );
    return {
      crudBinding,
      crudRef,
    };
  },
});
</script>
<style lang="less" scoped>
/deep/.fs-crud-container.compact .el-table--border {
  border-left: 1px solid #eee;
}
</style>
