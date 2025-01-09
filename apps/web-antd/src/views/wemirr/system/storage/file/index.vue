<script lang="ts" setup name="UserPageList">
import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { UploadOutlined } from '@ant-design/icons-vue';
import { FsIcon, useFs } from '@fast-crud/fast-crud';
import { Card, message } from 'ant-design-vue';

import { defHttp } from '#/api/request';

import * as api from './api';
import createCrudOptions from './crud';
import FileItem from './FileItem.vue';

const terrData = ref([
  { category: '', name: '全部' },
  { category: 'AUDIO', name: '音频' },
  { category: 'VIDEO', name: '视频' },
  { category: 'IMAGE', name: '图片' },
  { category: 'DOCUMENT', name: '文档' },
  { category: 'OTHER', name: '其它' },
]);
const nodeRef = ref();
const expandedKeys = ref();
const showTableRef = ref(true);
const selectedKeys = ref([]);

const showTableComputed = computed(() => {
  return showTableRef.value;
});

const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: { showTableComputed, showTableRef, nodeRef, permission: 'sys:user' },
});

onMounted(async () => {
  selectedKeys.value = [];
  await crudExpose.doRefresh();
});

const handleSelect = (checkedKeys: any, event: any) => {
  if (!event.selected) {
    return;
  }
  nodeRef.value = event.selectedNodes[0];
  // 更新颜色
  crudExpose.doRefresh();
};
const previewFile = (row: any) => {
  // 图片预览
  // if (row.category === 'IMAGE') {}
  if (row.category === 'DOCUMENT' || row.category === 'OTHER') {
    message.error('该格式暂不支持预览');
  }
};

// 上传
const handleUpload = (options: any) => {
  const controller = new AbortController();
  (async function requestWrap() {
    const { onProgress, onError, onSuccess, file, name = 'file' } = options;
    const formData = new FormData();
    formData.append(name as string, file as File);
    try {
      const res = await defHttp.post('/suite/file-storage/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          const complete = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress({ percent: Math.round(complete) });
        },
      });
      message.success('上传成功');
      onSuccess(res);
      crudExpose.doRefresh();
    } catch (error) {
      onError(error);
    }
  })();
  return {
    abort() {
      controller.abort();
    },
  };
};
function openEdit(opts: any) {
  crudExpose.openEdit(opts);
}
function doRemove(opts: any) {
  crudExpose.doRemove(opts);
}
const doDownload = (item: any) => {
  message.info({
    content: '开始下载',
    duration: 3,
  });
  api.downloadFile(item.url, item.originalFilename);
};
</script>

<template>
  <Page content-class="flex gap-2">
    <Card :bordered="false" class="w-1/4 xl:w-1/4">
      <a-tree
        v-model:expanded-keys="expandedKeys"
        v-model:selected-keys="selectedKeys"
        :auto-expand-parent="true"
        :default-expand-all="true"
        :field-names="{ key: 'category', title: 'name' }"
        :show-icon="false"
        :show-line="false"
        :tree-data="terrData"
        class="custom-tree"
        @select="handleSelect"
      >
        <!-- 使用作用域插槽自定义节点内容 -->
        <template #title="node">
          <span class="tree-node-content">
            <FileItem :data="node" class="tree-node-icon" />
            {{ node.name }}
          </span>
        </template>
      </a-tree>
    </Card>
    <Card class="sys-user-page-card w-full" title="文件管理">
      <fs-crud ref="crudRef" v-bind="crudBinding">
        <template #actionbar-left>
          <a-upload :custom-request="handleUpload" :show-upload-list="false">
            <a-button type="primary">
              <UploadOutlined />
              文件上传
            </a-button>
          </a-upload>

          <a-tooltip title="默认表格展,关闭展示卡片">
            <span class="ml-1">
              切换布局:<a-switch v-model:checked="showTableRef" />
            </span>
          </a-tooltip>
        </template>
        <template #cell_originalFilename="scope">
          <a-tooltip :title="scope.row.originalFilename" placement="topLeft">
            {{ scope.row.originalFilename }}
          </a-tooltip>
        </template>
        <template #cell_url="scope">
          <FileItem :data="scope.row" @click="previewFile(scope.row)" />
        </template>
        <div v-if="!showTableComputed">
          <a-row
            v-if="crudBinding.data"
            :gutter="10"
            style="height: 100%; width: 100%; overflow: auto"
          >
            <a-col
              v-for="(item, index) of crudBinding.data"
              :key="item.id"
              :span="4"
              style="margin-bottom: 10px"
            >
              <a-card class="square-card">
                <div class="card-content">
                  <FileItem :data="item" @click="previewFile(item)" />
                  <span :title="item.originalFilename" class="filename">{{
                    item.originalFilename
                  }}</span>
                </div>
                <template #actions>
                  <FsIcon
                    icon="ion:eye-outline"
                    title="浏览"
                    @click="previewFile(item)"
                  />
                  <FsIcon
                    icon="ion:trash-outline"
                    title="删除"
                    @click="doRemove({ index, row: item })"
                  />
                  <FsIcon
                    icon="ant-design:cloud-download-outlined"
                    title="下载"
                    @click="doDownload(item)"
                  />
                </template>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </fs-crud>
    </Card>
    <!--    <FilePreview
      v-model:show="filePreviewShow"
      :file-info="fileInfo"
      @close="fileInfo = {}"
    />-->
  </Page>
</template>

<style lang="less" scoped>
/deep/.p-4 {
  padding: 8px !important;
}
/deep/.sys-user-page-card {
  .fs-crud-container {
    min-height: 740px !important;
    max-height: 980px !important;
  }
  .ant-card-body {
    padding: 8px;
  }
}
.file-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/deep/.custom-card {
  width: 20%;
  max-width: 300px;
  margin: 0 auto;
}

/deep/.custom-tree .ant-tree-node-content-wrapper {
  font-size: 16px;
  text-align: center;
  padding: 8px;
  transition: background-color 0.3s;
}

/deep/.custom-tree .ant-tree-node-content-wrapper[style*='--node-color:'] {
  background-color: var(--node-color);
}

/deep/.custom-tree .ant-tree-node-selected .ant-tree-node-content-wrapper {
  --node-color: #ff0000;
}
.tree-node-content {
  display: flex;
  align-items: center;
  width: 150px;
}
.tree-node-icon {
  width: 40px;
  height: 40px;
  margin-right: 8px; /* 图标和文本之间的间距 */
}

.square-card {
  position: relative;
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 16px; /* 调整根据需要 */
  box-sizing: border-box;
}

.file-item {
  margin-bottom: 8px; /* 调整间�� */
}

.filename {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; /* 确保不会超出容器 */
  display: inline-block;
}
</style>
