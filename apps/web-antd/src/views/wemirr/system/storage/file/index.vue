<template>
  <Page content-class="flex gap-2">
    <Card :bordered="false" class="custom-card w-1/5 xl:w-1/5">
      <a-tree
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        :show-line="false"
        :show-icon="false"
        :auto-expand-parent="true"
        :default-expand-all="true"
        :treeData="terrData"
        :fieldNames="{ key: 'fileType', title: 'name' }"
        @select="handleSelect"
        class="custom-tree"
      >
        <!-- 使用作用域插槽自定义节点内容 -->
        <template #title="node">
          <span class="tree-node-content">
            <FileItem :data="node" class="tree-node-icon"></FileItem>

            {{ node.name }}
          </span>
        </template>
      </a-tree>
    </Card>
    <Card title="文件管理" class="sys-user-page-card w-full">
      <fs-crud ref="crudRef" v-bind="crudBinding">
        <template #actionbar-left>
          <a-upload :showUploadList="false" :custom-request="handleUpload">
            <a-button type="primary" shape="round">
              <template #default>上传</template>
            </a-button>
          </a-upload>

          <a-tooltip title="默认表格展示，关闭展示卡片">
            <span class="ml-1"
              >切换布局:<a-switch v-model:checked="showTableRef"></a-switch
            ></span>
          </a-tooltip>
        </template>
        <template #cell_url="scope">
          <FileItem
            @click="previewFile(scope.row)"
            :data="scope.row"
          ></FileItem>
        </template>
        <div v-if="!showTableComputed">
          <a-row
            v-if="crudBinding.data"
            gutter="10"
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
                  <FileItem :data="item" @click="previewFile(item)"></FileItem>
                  <span class="filename" :title="item.originalFilename">{{
                    item.originalFilename
                  }}</span>
                </div>
                <template #actions>
                  <fs-icon
                    title="浏览"
                    icon="ion:eye-outline"
                    @click="previewFile(item)"
                  ></fs-icon>
                  <fs-icon
                    title="重命名"
                    icon="ion:create-outline"
                    @click="openEdit({ index: index, row: item })"
                  ></fs-icon>
                  <fs-icon
                    title="删除"
                    icon="ion:trash-outline"
                    @click="doRemove({ index: index, row: item })"
                  ></fs-icon>
                  <fs-icon
                    title="下载"
                    icon="ant-design:cloud-download-outlined"
                    @click="doDownload(item)"
                  ></fs-icon>
                </template>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </fs-crud>
    </Card>
    <a-modal
      v-model:open="filePreviewShow"
      :width="1500"
      :hight="1000"
      title="文件预览"
      @close="onClose"
      :on-before-close="onClose"
      :footer="false"
      esc-to-close="esc-to-close"
      @ok="onClose"
      @cancel="onClose"
    >
      <VueOfficePdf
        style="height: 100vh"
        v-if="fileInfo?.ext === 'pdf'"
        :src="fileInfo?.url"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
      <VueOfficeDocx
        v-else-if="WordTypes.includes(fileInfo?.ext || '')"
        :src="fileInfo?.url"
        style="height: 80vh"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
      <VueOfficeExcel
        v-else-if="ExcelTypes.includes(fileInfo?.ext || '')"
        :src="fileInfo?.url"
        style="height: 80vh; width: 100%"
        :options="excelConfig"
        @rendered="renderedHandler"
        @error="errorHandler"
      />
    </a-modal>
  </Page>
</template>

<script lang="ts" setup name="UserPageList">
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';
import { api as viewerApi } from 'v-viewer';

import { message } from 'ant-design-vue';
import { ref, onMounted, computed } from 'vue';
import createCrudOptions from './crud';
import * as api from './api';

import { useFs } from '@fast-crud/fast-crud';
import { Card } from 'ant-design-vue';
import { Page } from '@vben/common-ui';
import { defHttp } from '#/api/request';
import ImgSvg from '../svg/index.vue';
import FileItem from './FileItem.vue';
import VueOfficePdf from '@vue-office/pdf';
import VueOfficeDocx from '@vue-office/docx';
import VueOfficeExcel from '@vue-office/excel';
/** WPS、Office文件类型 */
const WordTypes = ['doc', 'docx'];
const ExcelTypes = ['xls', 'xlsx'];

const terrData = ref([
  { fileType: '', name: '全部' },
  { fileType: 'AUDIO', name: '音频' },
  { fileType: 'VIDEO', name: '视频' },
  { fileType: 'IMAGE', name: '图片' },
  { fileType: 'DOCUMENT', name: '文档' },
  { fileType: 'OTHER', name: '其它' },
]);
const nodeRef = ref();
const expandedKeys = ref();
const showTableComputed = computed(() => {
  return showTableRef.value;
});
const selectedKeys = ref([]);
const showTableRef = ref(true);
const filePreviewShow = ref(false);
const fileInfo = ref();
const excelConfig = ref();

const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: { showTableComputed, showTableRef, nodeRef, permission: 'sys:user' },
});

onMounted(async () => {
  //await initOrgList();
  selectedKeys.value = [''];
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
  //图片预览
  if (row.fileType == 'IMAGE') {
    const imageUrlsArray = crudBinding._rawValue.data
      .filter((item) => item.fileType === 'IMAGE') // 过滤条件
      .map((item) => item.url); // 提取 URL
    const index = imageUrlsArray.findIndex((i) => i === row.url);

    viewerApi({
      options: {
        initialViewIndex: index,
      },
      images: imageUrlsArray,
    });
  }
  //offic预览
  //pdf预览
  //mpc预览
  if (row.fileType == 'DOCUMENT') {
    excelConfig.value = {
      xls: false,
      minColLength: 0,
      minRowLength: 0,
      widthOffset: 10,
      heightOffset: 10,
      beforeTransformData: (workbookData: any) => {
        return workbookData;
      },
      transformData: (workbookData: any) => {
        return workbookData;
      },
    };
    filePreviewShow.value = true;
    fileInfo.value = row;
  }
  if (row.fileType == 'OTHER') {
    message.error('该格式暂不支持预览');
  }
  //视频预览
};
const renderedHandler = () => {
  // message.success('文件加载完成');
};
const errorHandler = () => {
  message.error('文件加载失败');
};

// 上传
const handleUpload = (options: RequestOption) => {
  const controller = new AbortController();
  (async function requestWrap() {
    const { onProgress, onError, onSuccess, file, name = 'file' } = options;

    let percent = 0;
    const interval = setInterval(() => {
      if (percent < 100) {
        percent += 10;
        onProgress({ percent });
      }
    }, 200);
    const formData = new FormData();
    formData.append(name as string, file as File);
    try {
      const res = await defHttp.post('/suite/file-storage/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
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
// 关闭弹框
const onClose = () => {
  fileInfo.value = {};
  filePreviewShow.value = false;
  excelConfig.value = {};
};
</script>

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
  margin-bottom: 8px; /* 调整间距 */
}

.filename {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; /* 确保不会超出容器 */
  display: inline-block;
}
</style>
