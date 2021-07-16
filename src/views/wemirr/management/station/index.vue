<template>
  <PageWrapper contentClass="flex" class="bg-white m-4 mr-0">
    <a-card :bordered="false" class="w-1/3 xl:w-1/4">
      <BasicTree
        search
        checkable
        checkStrictly
        @check="onTreeNodeCheck"
        ref="terrDataRef"
        :treeData="terrData"
        :replaceFields="{ key: 'id', title: 'name' }"
        @select="handleSelect"
      />
    </a-card>
    <a-card :bordered="false" class="w-full xl:w-full station">
      <fs-crud ref="crudRef" v-bind="crudBinding" />
    </a-card>
  </PageWrapper>
</template>

<script>
  import { defineComponent, ref, onMounted, unref } from 'vue';
  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  import { BasicTree } from '/@/components/Tree';
  import { PageWrapper } from '/@/components/Page';
  import { getOrgList } from '/@/api/sys/org';

  export default defineComponent({
    name: 'StationForm',
    components: { BasicTree, PageWrapper },
    setup() {
      const terrDataRef = ref({});
      const terrData = ref();
      const nodeRef = ref();
      // crud组件的ref
      const crudRef = ref();
      // crud 配置的ref
      const crudBinding = ref();
      // 暴露的方法
      const { expose } = useExpose({ crudRef, crudBinding });
      // 你的crud配置
      const { crudOptions } = createCrudOptions({ expose, nodeRef });
      // 初始化crud配置
      useCrud({ expose, crudOptions });

      // 页面打开后获取列表数据
      onMounted(() => {
        getOrgList();
        expose.doRefresh();
      });

      getOrgList().then((ret) => {
        terrData.value = ret;
        setTimeout(() => {
          getTree().filterByLevel(2);
        }, 0);
      });
      function handleSelect(checkedKeys, event) {
        if (!event.selected) {
          return;
        }
        nodeRef.value = event.selectedNodes[0].props;
        expose.doRefresh();
      }
      function onTreeNodeCheck(keys, event) {
        console.log('keys event', keys, event);
        if (!event.checked) {
        } else {
        }
      }
      function getTree() {
        const tree = unref(terrDataRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }
      return {
        terrDataRef,
        terrData,
        crudBinding,
        crudRef,
        handleSelect,
        onTreeNodeCheck,
      };
    },
  });
</script>

<style lang="less">
  .station {
    margin-left: 10px;
    min-height: 1050px;
    .footer {
      .fs-crud-footer {
        padding: 30px 0;
      }
    }
  }
</style>
