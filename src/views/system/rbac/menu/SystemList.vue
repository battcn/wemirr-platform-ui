<template>
  <div class="m-4 mr-0 overflow-hidden bg-white" :class="prefixCls">
    <BasicTree
      title="系统列表"
      search
      default-expand-all
      :show-icon="true"
      :clickRowToExpand="false"
      :toolbar="false"
      :treeData="systemData"
      :fieldNames="{ key: 'systemId', title: 'systemName' }"
      @select="handleSelect"
    >
      <template #title="{ icon, systemName }">
        <div>
          <a-avatar shape="square" :size="20" :src="getPictureUrl(icon)" v-if="icon" />
          <span style="margin-left: 7px">{{ systemName }}</span>
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
  import { getList } from '/@/api/modules/system/rbac/rbacSystem';
  import { RbacSystemDto } from '/@/api/modules/system/rbac/model/rbacSystemModel';
  const { prefixCls } = useDesign('system-list');
  const emit = defineEmits(['select']);
  const systemData = ref<RbacSystemDto[]>([]);
  async function fetch() {
    const data = await getList();
    if (data && data.length > 0) {
      data.forEach((item) => {
        item.slots = { icon: 'custom' };
      });
    }
    systemData.value = data;
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
  @prefix-cls: ~'@{namespace}-system-list';
  .@{prefix-cls} {
    .ant-tree li .ant-tree-node-content-wrapper {
      height: 27px;
    }
  }
</style>
