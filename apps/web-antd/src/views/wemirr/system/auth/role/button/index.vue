<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import { useFsAsync, useFsRef } from '@fast-crud/fast-crud';

import createCrudOptions from './crud.js';

export default defineComponent({
  name: 'ResourceButtonTable',
  setup() {
    const { crudRef, crudBinding, crudExpose, context } = useFsRef();
    context.permission = 'sys:menu';
    // 页面打开后获取列表数据
    onMounted(async () => {
      await useFsAsync({
        crudBinding,
        crudRef,
        crudExpose,
        context,
        createCrudOptions,
      });
      await crudExpose.doRefresh();
    });

    return {
      crudBinding,
      crudRef,
      setSearchFormData: crudExpose.setSearchFormData,
      doRefresh: crudExpose.doRefresh,
      selectedRowKeys: context.selectedRowKeys,
    };
  },
});
</script>

<template>
  <fs-crud ref="crudRef" v-bind="crudBinding" />
</template>

<style lang="less" scoped></style>
