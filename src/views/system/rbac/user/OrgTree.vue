<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      title="机构列表"
      toolbar
      search
      :clickRowToExpand="false"
      :treeData="treeData"
      ref="asyncExpandTreeRef"
      :fieldNames="{ key: 'orgId', title: 'orgName' }"
      @select="handleSelect"
    >
      <template #title="item">
        <span>
          {{ item.orgName }}
        </span>
        <a-tag
          :color="item.orgType === 1 ? 'blue' : 'green'"
          style="margin-left: 4px; line-height: 18px; padding: 0 5px"
        >
          {{ item.orgType === 1 ? '公司' : '部门' }}
        </a-tag>
      </template>
    </BasicTree>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, nextTick, unref } from 'vue';

  import { BasicTree } from '/@/components/Tree';
  import { selectOrgTreeList } from '/@/api/modules/system/rbac/rbacOrg';
  import { RbacOrgTreeDto } from '/@/api/modules/system/rbac/model/rbacOrgModel';
  const emit = defineEmits(['select']);
  const asyncExpandTreeRef = ref();
  const treeData = ref<RbacOrgTreeDto[]>([]);

  async function fetch() {
    treeData.value = await selectOrgTreeList(1);
    // 默认展开一级
    nextTick(() => {
      unref(asyncExpandTreeRef)?.filterByLevel(1);
    });
  }

  function handleSelect(keys: any) {
    emit('select', keys[0]);
  }
  onMounted(() => {
    fetch();
  });
</script>
