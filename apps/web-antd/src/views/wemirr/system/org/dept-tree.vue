<script setup lang="ts">
import type { PropType } from 'vue';

import type { DeptTree } from '#/api/system/user/model';

import { onMounted, ref, watch } from 'vue';

import { filterTree } from '@vben/utils';

import { Empty, InputSearch, Skeleton, Tree } from 'ant-design-vue';

import { getOrgTree } from '#/api/core/org';

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<{ showSearch?: boolean }>(), { showSearch: true });

const emit = defineEmits<{
  /**
   * 点击刷新按钮的事件
   */
  reload: [];
  /**
   * 点击节点的事件
   */
  select: [selectedKeys: any, e: any];
}>();

const selectDeptId = defineModel('selectDeptId', {
  required: true,
  type: Array as PropType<string[]>,
});

const searchValue = defineModel('searchValue', {
  type: String,
  default: '',
});

/** 部门数据源 */
type DeptTreeArray = DeptTree[];
const deptTreeArray = ref<DeptTreeArray>([]);
const originDeptTreeArray = ref<DeptTreeArray>([]);
/** 骨架屏加载 */
const showTreeSkeleton = ref<boolean>(true);
const expandedKeys = ref<string[]>([]);

async function loadTree() {
  showTreeSkeleton.value = true;
  searchValue.value = '';
  selectDeptId.value = [];

  const ret = await getOrgTree({});

  deptTreeArray.value = ret;
  originDeptTreeArray.value = ret;
  showTreeSkeleton.value = false;
  // 默认展开所有
  expandedKeys.value = getAllKeys(ret);
}

// 获取所有节点的key
function getAllKeys(data: DeptTreeArray): string[] {
  let keys: string[] = [];
  data.forEach((item) => {
    keys.push(String(item.id));
    if (item.children) {
      keys = [...keys, ...getAllKeys(item.children)];
    }
  });
  return keys;
}

// 监听搜索变化进行过滤
watch(searchValue, (val) => {
  if (!val) {
    deptTreeArray.value = originDeptTreeArray.value;
    expandedKeys.value = getAllKeys(deptTreeArray.value);
    return;
  }
  deptTreeArray.value = filterTree(originDeptTreeArray.value, (node) => {
    return node.label.includes(val);
  });
  // 搜索时展开所有匹配的节点
  expandedKeys.value = getAllKeys(deptTreeArray.value);
});

function onSelect(selectedKeys: any, e: any) {
  emit('select', selectedKeys, e);
}

onMounted(loadTree);

defineExpose({ loadTree });
</script>

<template>
  <div :class="$attrs.class" class="h-full">
    <Skeleton
      :loading="showTreeSkeleton"
      :paragraph="{ rows: 8 }"
      active
      class="p-2"
    >
      <div
        class="bg-background flex h-full flex-col overflow-hidden rounded-lg"
      >
        <!-- 搜索区域 -->
        <div
          v-if="showSearch"
          class="flex items-center gap-2 border-b border-gray-100 p-3 dark:border-gray-800"
        >
          <InputSearch
            v-model:value="searchValue"
            :placeholder="$t('system.common.search')"
            allow-clear
            class="flex-1"
          />
        </div>

        <!-- 树区域 -->
        <div class="hide-scrollbar flex-1 overflow-y-auto scroll-smooth p-2">
          <transition-group name="fade" tag="div">
            <Tree
              v-bind="$attrs"
              v-if="deptTreeArray.length > 0"
              v-model:expanded-keys="expandedKeys"
              v-model:selected-keys="selectDeptId"
              :class="$attrs.class"
              :field-names="{ title: 'label', key: 'id' }"
              :show-line="{ showLeafIcon: false }"
              :tree-data="deptTreeArray"
              :virtual="false"
              block-node
              @select="onSelect"
            >
              <template #title="{ label }">
                <span v-if="label.includes(searchValue)">
                  {{ label.substring(0, label.indexOf(searchValue)) }}
                  <span style="color: #f50">{{ searchValue }}</span>
                  {{
                    label.substring(
                      label.indexOf(searchValue) + searchValue.length,
                    )
                  }}
                </span>
                <span v-else>{{ label }}</span>
              </template>
            </Tree>
            <!-- 仅本人数据权限 可以考虑直接不显示 -->
            <div v-else class="mt-5">
              <Empty
                :image="Empty.PRESENTED_IMAGE_SIMPLE"
                description="无部门数据"
              />
            </div>
          </transition-group>
        </div>
      </div>
    </Skeleton>
  </div>
</template>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* 简单的淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
