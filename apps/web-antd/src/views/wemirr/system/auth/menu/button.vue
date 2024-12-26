<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import createCrudOptions from './button';

export default defineComponent({
  name: 'ResourceButtonTable',
  setup() {
    const parentId = ref();
    const { crudRef, crudBinding, crudExpose } = useFs({
      createCrudOptions,
      context: { parentId, permission: 'sys:menu' },
    });
    // 页面打开后获取列表数据
    onMounted(() => {});

    return {
      crudBinding,
      crudRef,
      parentId,
      setSearchFormData: crudExpose.setSearchFormData,
      doRefresh: crudExpose.doRefresh,
    };
  },
});
</script>

<template>
  <fs-crud ref="crudRef" v-bind="crudBinding" />
</template>

<style lang="less" scoped></style>
