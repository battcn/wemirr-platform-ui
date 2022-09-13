<template>
  <div class="m-4 mr-0 overflow-hidden bg-white" :class="prefixCls">
    <BasicTree
      title="类别列表"
      search
      default-expand-all
      :show-icon="true"
      :clickRowToExpand="false"
      :toolbar="false"
      :treeData="categoryData"
      :fieldNames="{ key: 'categoryCode', title: 'categoryName' }"
      @select="handleSelect"
    >
      <template #title="{ pictures, categoryName }">
        <div>
          <a-avatar shape="square" :size="20" :src="getPictureUrl(pictures)" v-if="pictures" />
          <span style="margin-left: 7px">{{ categoryName }}</span>
        </div>
      </template>
    </BasicTree>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getAttachmentUrl } from '/@/utils';
  import { BasicTree } from '/@/components/Tree';
  import { getList } from '/@/api/modules/process/base/processCategory';
  import { ProcessCategoryDto } from '/@/api/modules/process/base/model/processCategoryModel';
  const { prefixCls } = useDesign('category-list');
  const emit = defineEmits(['select']);
  const categoryData = ref<ProcessCategoryDto[]>([]);
  async function fetch() {
    const data = await getList({ categoryState: 1 });
    if (data && data.length > 0) {
      data.forEach((item) => {
        item.slots = { icon: 'custom' };
      });
    }
    categoryData.value = data;
  }
  function handleSelect(keys) {
    emit('select', keys[0]);
  }
  function getPictureUrl(url: string) {
    return getAttachmentUrl(url);
  }
  onMounted(() => {
    fetch();
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-category-list';
  .@{prefix-cls} {
    .ant-tree li .ant-tree-node-content-wrapper {
      height: 27px;
    }
  }
</style>
