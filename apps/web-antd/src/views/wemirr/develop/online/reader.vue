<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useFsAsync, useFsRef } from '@fast-crud/fast-crud';

import createCrudOptions from './reader';

const route = useRoute();
const definitionKey: any = route.query.definitionKey;
const { crudRef, crudBinding, crudExpose, context } = useFsRef();
// 初始化crud配置
// 页面打开后获取列表数据
onMounted(async () => {
  // 异步初始化fs，createCrudOptions为异步方法
  context.definitionKey = definitionKey;
  await useFsAsync({
    crudRef,
    crudBinding,
    crudExpose,
    context,
    createCrudOptions,
  });

  // crudBinding.form?.definitionKey.value = definitionKey;
  // 刷新数据
  await crudExpose.doRefresh();
});
</script>

<template>
  <fs-page>
    <fs-crud v-if="crudBinding" ref="crudRef" v-bind="crudBinding" />
  </fs-page>
</template>
