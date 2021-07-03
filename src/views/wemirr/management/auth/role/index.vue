<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #form_orgList="scope">
      <BasicTree
        v-model:value="scope.form.orgList"
        :treeData="treeData"
        :replaceFields="{ title: 'name', key: 'id' }"
        checkable
        toolbar
        v-if="scope.form.scopeType === 20"
        title="组织架构"
      />
    </template>
  </fs-crud>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  import { request } from '/src/api/service';
  import { BasicTree } from '/@/components/Tree';

  export default defineComponent({
    name: 'SlotsForm',
    components: { BasicTree },

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
      const { resetCrudOptions } = useCrud({ expose, crudOptions });
      // 你可以调用此方法，重新初始化crud配置
      // resetCrudOptions(options)

      // let treeData = [];
      const treeData = ref([]);

      function initOrgList() {
        request({
          url: '/authority/org/trees',
          method: 'get',
          params: { status: true },
        }).then((response) => {
          treeData.value = response.data;
          console.log('treeData', treeData);
        });
      }
      // 页面打开后获取列表数据
      onMounted(() => {
        initOrgList();
        expose.doRefresh();
      });

      return {
        treeData,
        crudBinding,
        crudRef,
      };
    },
  });
</script>
