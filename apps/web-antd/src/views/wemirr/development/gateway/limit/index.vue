<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import { GetList } from './api';
import createCrudOptions from './crud';

export default defineComponent({
  name: 'GatewayLimitPageList',
  setup() {
    // crud组件的ref
    const crudRef = ref();
    // crud 配置的ref
    const crudBinding = ref();

    const localDataRef = ref();

    onMounted(async () => {
      // 先加载后台数据
      localDataRef.value = await GetList({
        page: { offset: 0, current: 1, size: 99_999_999 },
        query: {},
        sort: {},
      });

      const { crudExpose } = useFs({
        crudBinding,
        crudRef,
        createCrudOptions,
        context: { localDataRef },
      });

      // 页面打开后获取列表数据
      await crudExpose.doRefresh();
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
    <fs-crud v-if="crudBinding" ref="crudRef" v-bind="crudBinding" />
  </fs-page>
</template>
