<template>
  <a-checkbox-group class="role-auth-menu-parent" v-model:value="checkedList">
    <ul class="role-auth-menu-ul">
      <li v-for="item in data" :key="item.menuId" class="role-auth-menu-li">
        <a-checkbox
          :value="item.menuId"
          @click.prevent="selectCheckbox(item)"
          :indeterminate="indeterminate"
        >
          {{ item.metaTitle }}
        </a-checkbox>
        <MenuAuthItem
          :data="item.children"
          :linkage="linkage"
          v-if="item.menuType == 0 && item.children"
          :value="value"
        />
        <a-checkbox-group
          class="role-auth-menu-menu-checkbox"
          v-else-if="item.children"
          v-model:value="checkedList"
        >
          <template v-for="subItem in item.children" :key="subItem.menuId">
            <a-checkbox :value="subItem.menuId" @click.prevent="selectCheckbox(subItem)">
              {{ subItem.metaTitle }}
            </a-checkbox>
          </template>
        </a-checkbox-group>
      </li>
    </ul>
  </a-checkbox-group>
</template>
<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, watch } from 'vue';
  const props = defineProps({
    data: {
      type: Object as PropType<any[]>,
      default: () => [] as any[],
    },
    value: {
      type: Object as PropType<string[]>,
      default: () => [] as string[],
    },
    linkage: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['change']);
  const checkedList = ref<string[]>([]);
  const indeterminate = ref(false);
  watch(
    () => props.value,
    (val, old) => {
      if (val !== old) {
        checkedList.value = props.value;
      }
    },
    { immediate: true, deep: true },
  );
  function selectCheckbox(item: any) {
    const menuId = item.menuId;
    let findIndex = checkedList.value.findIndex((val) => val == menuId);
    if (findIndex != -1) {
      checkedList.value.splice(findIndex, 1);
      if (props.linkage && item.children && item.children.length > 0) {
        getAllMenuId(item.children, true);
      }
    } else {
      checkedList.value.push(item.menuId);
      if (props.linkage && item.children && item.children.length > 0) {
        getAllMenuId(item.children, false);
      }
    }

    emit('change', checkedList.value);
  }

  function getAllMenuId(children: any[], clear: boolean) {
    const length = children?.length || 0;
    if (length > 0) {
      for (var index = 0; index < length; index++) {
        const item = children[index];
        let findIndex = checkedList.value.findIndex((val) => val == item.menuId);
        if (findIndex == -1 && !clear) {
          checkedList.value.push(item.menuId);
        } else if (findIndex !== -1 && clear) {
          checkedList.value.splice(findIndex, 1);
        }
        if (item.children && item.children.length > 0) {
          getAllMenuId(item.children, clear);
        }
      }
    }
  }
</script>

<style lang="less">
  .role-auth-menu-parent {
    position: relative;
    width: 100%;

    .role-auth-menu-ul {
      width: 100%;
      // padding: 10px;

      .role-auth-menu-li {
        display: flex;
        border-left: 1px solid @border-color-base;
        border-bottom: 1px solid @border-color-base;
        padding-left: 10px;
        align-items: center;
        padding-top: 10px;
        padding-bottom: 10px;

        .ant-checkbox-wrapper {
          min-width: 150px;
        }

        .ant-checkbox-wrapper + .ant-checkbox-wrapper {
          margin-left: 0px;
        }

        .role-auth-menu-menu-checkbox {
          width: 100%;
          padding-top: 10px;
          padding-left: 5px;
          padding-bottom: 10px;
          border-left: 1px solid @border-color-base;
        }
      }
    }
  }
</style>
