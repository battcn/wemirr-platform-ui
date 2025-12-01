<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue';

import { Modal, Spin, Tree } from 'ant-design-vue';

import { defHttp } from '#/api/request';

import CdeEditorMi from './code-edtior-mi.vue';

const props = defineProps<{
  onClose: () => void;
  preId: string;
  visible: boolean;
}>();

const treeData = ref([]);
const codeContent = ref('');
const loading = ref(false);
const codeMap = ref<Record<string, string>>({});

const convertToTreeData = (data: Record<string, string>): Array<any> => {
  const tree: Array<any> = [];
  const map: Record<string, any> = {};

  Object.keys(data).forEach((path) => {
    const parts = path.split('/');
    let currentLevel = tree;

    parts.forEach((part, index) => {
      const fullPath = parts.slice(0, index + 1).join('/');
      if (!map[fullPath]) {
        const node = {
          title: part,
          key: fullPath,
          children: [],
        };
        map[fullPath] = node;
        currentLevel.push(node);
      }
      currentLevel = map[fullPath].children;
    });
  });

  // return tree;
  const result = tree;
  result.forEach(compressPath);
  return result;
};
// 压缩路径的处理函数
const compressPath = (node: any) => {
  if (node.children.length === 1 && !codeMap.value[node.key]) {
    const child = node.children[0];
    node.title = `${node.title}.${child.title}`;
    node.key = child.key;
    node.children = child.children;
    compressPath(node);
  } else {
    node.children.forEach(compressPath);
  }
};
const fetchCodeData = async () => {
  loading.value = true;
  try {
    const res = await defHttp.get(
      `/suite/generate-table/${props.preId}/preview`,
    );
    const data = res;
    treeData.value = convertToTreeData(data);
    codeMap.value = data;
    codeContent.value = data[Object.keys(data)[0]] || '';
  } catch (error) {
    console.error('Failed to fetch code data:', error);
  } finally {
    loading.value = false;
  }
};

const handleSelect = (selectedKeys: string[]) => {
  if (selectedKeys.length > 0) {
    const selectedKey = selectedKeys[0];
    codeContent.value = codeMap.value[selectedKey] || '';
  }
};

const handleClose = () => {
  props.onClose();
};

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      fetchCodeData();
    }
  },
);
</script>

<template>
  <Modal
    :open="visible"
    title="代码预览"
    :footer="null"
    width="80%"
    @cancel="handleClose"
    @update:open="handleClose"
  >
    <Spin :spinning="loading">
      <div style="display: flex; height: 100%">
        <div style="width: 30%; overflow: auto">
          <Tree
            :tree-data="treeData"
            @select="handleSelect"
            default-expand-all
          />
        </div>
        <div style="width: 70%; padding: 16px; overflow: auto">
          <!-- <pre>{{ codeContent }}</pre> -->
          <CdeEditorMi
            v-model:command="codeContent"
            :read-only="true"
            :height="700"
          />
        </div>
      </div>
    </Spin>
  </Modal>
</template>
<style scoped>
.ant-spin-nested-loading > div > .ant-spin {
  max-height: 100%;
}
</style>
