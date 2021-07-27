<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #cell_nickName="scope">
      <a-tooltip placement="top" :title="scope.row.nickName">
        {{ scope.row.nickName }}
      </a-tooltip>
    </template>
  </fs-crud>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  export default defineComponent({
    name: 'FormGroup',
    setup() {
      const crudRef = ref();
      const crudBinding = ref();
      const { expose } = useExpose({ crudRef, crudBinding });
      const { crudOptions } = createCrudOptions({ expose });
      useCrud({ expose, crudOptions, permission: 'user:management' });

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
