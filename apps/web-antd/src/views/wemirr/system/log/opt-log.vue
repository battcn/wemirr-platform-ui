<script lang="ts" setup name="OptLogPage">
import type { DownOutlined } from '@ant-design/icons-vue';

import { onMounted } from 'vue';

import { useFs } from '@fast-crud/fast-crud';
import { Modal, notification } from 'ant-design-vue';

import { defHttp } from '#/api/request';

import createCrudOptions from './opt-log';

const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions });
// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});

const handleBatchDelete = (e: any) => {
  Modal.confirm({
    iconType: 'warning',
    title: '提示',
    content: '是否批量删除',
    onOk: async () => {
      defHttp.delete(`/iam/opt_logs/${e.key}`).then(() => {
        notification.success({
          message: '批量删除成功',
          duration: 3,
        });
        crudExpose.doRefresh();
      });
    },
  });
};
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_action="scope">
        <a-tooltip :title="scope.row.action" placement="top">
          {{ scope.row.action }}
        </a-tooltip>
      </template>
      <template #actionbar-right>
        <a-dropdown class="ml-1" type="primary">
          <template #overlay>
            <a-menu @click="handleBatchDelete">
              <a-menu-item key="1">一天前</a-menu-item>
              <a-menu-item key="7">七天前</a-menu-item>
              <a-menu-item key="15">十五天前</a-menu-item>
              <a-menu-item key="30">三十天前</a-menu-item>
            </a-menu>
          </template>
          <a-button>
            批量删除
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </template>
    </fs-crud>
  </fs-page>
</template>
