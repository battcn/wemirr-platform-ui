<template>
  <div>
    <MenuAuthItem
      :data="data.menuTree"
      v-if="data.menuTree && data.menuTree.length > 0"
      class="menu-auth"
      :linkage="linkage"
      v-model:value="data.selectTree"
    />
    <a-empty v-else />
  </div>
</template>
<script lang="ts" setup>
  import MenuAuthItem from './MenuAuthItem.vue';
  import { reactive, onMounted, watch } from 'vue';
  import { getMenuTree } from '/@/api/modules/system/rbac/rbacOrg';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  const params = reactive(route.query as any);
  const data = reactive({
    menuTree: [] as any[],
    selectTree: [] as string[],
  });
  const props = defineProps({
    value: {
      type: Object as PropType<string[]>,
      default: () => [] as string[],
    },
    selectAll: {
      type: Boolean,
      default: false,
    },
    linkage: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['change']);
  watch(
    () => props.value,
    (val, old) => {
      if (val !== old) {
        data.selectTree = props.value;
      }
    },
    { immediate: true, deep: true },
  );
  watch(
    () => data.selectTree,
    (val, old) => {
      if (val !== old) {
        emit('change', data.selectTree);
      }
    },
    { immediate: true, deep: true },
  );
  watch(
    () => props.selectAll,
    (val, old) => {
      if (val !== old) {
        if (props.selectAll) {
          getAllMenuId(data.menuTree);
        } else if (old != undefined) {
          data.selectTree = [];
        }
        emit('change', data.selectTree);
      }
    },
    { immediate: true },
  );
  function getAllMenuId(children: any[]) {
    const length = children?.length || 0;
    if (length > 0) {
      for (var index = 0; index < length; index++) {
        const item = children[index];
        let findIndex = data.selectTree.findIndex((val) => val == item.menuId);
        if (findIndex == -1) {
          data.selectTree.push(item.menuId);
        }
        if (item.children && item.children.length > 0) {
          getAllMenuId(item.children);
        }
      }
    }
  }
  async function handleMenuTree() {
    data.menuTree = await getMenuTree(params.orgId);
  }
  onMounted(() => {
    handleMenuTree();
  });
</script>

<style lang="less">
  .menu-auth {
    border: 1px solid @border-color-base;

    min-height: 60vh;
    overflow: auto;
  }
</style>
