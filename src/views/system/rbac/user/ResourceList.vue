<template>
  <div :class="prefixCls">
    <BasicTree
      title="资源列表"
      search
      default-expand-all
      :show-icon="true"
      :clickRowToExpand="false"
      :toolbar="false"
      :tree-data="resourceData"
      :fieldNames="{ key: 'resourceIdAndTag', title: 'resourceName' }"
      @select="handleSelect"
    >
      <template #title="{ resourceIcon, resourceName, resourceStatus }">
        <div>
          <a-avatar
            shape="square"
            :size="20"
            :src="getPictureUrl(resourceIcon)"
            v-if="resourceIcon"
          />
          <span style="margin-left: 7px">{{ resourceName }}</span>
          <span style="color: #f5222d" v-if="resourceStatus == 0">(禁用)</span>
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
  import { selectResourceList } from '/@/api/modules/system/rbac/rbacOrg';
  import { RbacResourceDto } from '/@/api/modules/system/rbac/model/rbacResourceModel';
  const { prefixCls } = useDesign('system-list');
  const emit = defineEmits(['select']);
  const resourceData = ref<RbacResourceDto[]>([]);
  async function fetch() {
    const data = await selectResourceList();
    if (data && data.length > 0) {
      data.forEach((item) => {
        item.slots = { icon: 'custom' };
      });
    }
    resourceData.value = data;
  }
  function handleSelect(__keys: any, e: { selected: boolean; selectedNodes; node; event }) {
    emit('select', e.selectedNodes[0]);
  }
  function getPictureUrl(url: string) {
    return getAttachmentUrl(url);
  }
  onMounted(() => {
    fetch();
  });
  defineExpose({
    fetch,
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-system-list';
  .@{prefix-cls} {
    .ant-tree li .ant-tree-node-content-wrapper {
      height: 27px;
    }
  }
</style>
