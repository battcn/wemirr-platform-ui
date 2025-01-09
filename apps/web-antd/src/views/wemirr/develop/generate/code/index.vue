<script>
import { defineComponent, onMounted } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import createCrudOptions from './crud';

export default defineComponent({
  name: 'GenerateCodePageList',
  setup() {
    // const userStore = useUserStore();
    const { crudRef, crudBinding, crudExpose } = useFs({
      createCrudOptions,
      // userStore,
    });
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

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_rootDir="scope">
        <a-tooltip :title="scope.row.rootDir" placement="top">
          {{ scope.row.rootDir }}
        </a-tooltip>
      </template>
      <template #cell_parentPackage="scope">
        <a-tooltip :title="scope.row.parentPackage" placement="top">
          {{ scope.row.parentPackage }}
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>
