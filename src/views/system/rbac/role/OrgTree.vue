<template>
  <div>
    <BasicTree
      title="机构列表"
      toolbar
      search
      checkable
      v-model:value="checkedKeys"
      :treeData="treeData"
      ref="asyncExpandTreeRef"
      @check="handleCheck"
      :fieldNames="{ key: 'orgId', title: 'orgName' }"
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
  import { onMounted, ref, nextTick, unref, watch } from 'vue';
  import { BasicTree } from '/@/components/Tree';
  import { selectOrgTreeList } from '/@/api/modules/system/rbac/rbacOrg';
  import { RbacOrgTreeDto } from '/@/api/modules/system/rbac/model/rbacOrgModel';
  const emit = defineEmits(['change']);
  const asyncExpandTreeRef = ref();
  const treeData = ref<RbacOrgTreeDto[]>([]);
  const checkedKeys = ref<string[]>(['1543380652053282816']);
  const props = defineProps({
    value: {
      type: Object as PropType<string[]>,
      default: () => [] as string[],
    },
  });
  watch(
    () => props.value,
    (val, old) => {
      if (val !== old) {
        checkedKeys.value = props.value;
      }
    },
    { immediate: true, deep: true },
  );
  async function fetch() {
    treeData.value = await selectOrgTreeList(1);
    // 默认展开一级
    nextTick(() => {
      unref(asyncExpandTreeRef)?.filterByLevel(2);
    });
  }
  function handleCheck() {
    emit('change', checkedKeys.value);
  }
  onMounted(() => {
    fetch();
  });
</script>
