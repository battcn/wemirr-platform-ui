<script lang="ts" setup name="BpmProcessCategoryPage">
import { onMounted } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

// import { IconPicker } from '#/components/Icon';
import createCrudOptions from './crud';

// 通过context传递到crud.tsx中
const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions });

// 页面打开后获取列表数据
onMounted(async () => {
  await crudExpose.doRefresh();
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <!--      <template #form_icon="scope">
        <IconPicker v-model:value="scope.form.icon" />
      </template>-->
    </fs-crud>
  </fs-page>
</template>
