<script lang="ts" setup name="ResourceButtonTable">
import { ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import createCrudOptions from './button';

const parentId = ref();
const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: { parentId, permission: 'sys:menu' },
});

function setParentId(id: string) {
  parentId.value = id;
}

defineExpose({
  crudBinding,
  crudExpose,
  doRefresh: crudExpose.doRefresh,
  parentId,
  setParentId,
  setSearchFormData: crudExpose.setSearchFormData,
});
</script>

<template>
  <fs-crud ref="crudRef" v-bind="crudBinding" />
</template>

<style lang="less" scoped></style>
