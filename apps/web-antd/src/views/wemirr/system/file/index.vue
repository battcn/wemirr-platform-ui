<script>
import { defineComponent, onMounted } from 'vue';

import { useFs } from '@fast-crud/fast-crud';
import { notification } from 'ant-design-vue';

import createCrudOptions from './crud';

export default defineComponent({
  name: 'SysFilePage',
  setup() {
    const { crudRef, crudBinding, crudExpose } = useFs({ createCrudOptions });
    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
    });

    function handleChange() {
      notification.success({ message: '上传成功', duration: 2 });
      expose.doRefresh();
    }

    return {
      handleChange,
      crudBinding,
      crudRef,
    };
  },
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #actionbar-right> 上传按钮 </template>
      <template #cell_originName="scope">
        <a-tooltip :title="scope.row.originName" placement="topLeft">
          {{ scope.row.originName }}
        </a-tooltip>
      </template>
      <template #cell_targetName="scope">
        <a-tooltip :title="scope.row.targetName" placement="topLeft">
          {{ scope.row.targetName }}
        </a-tooltip>
      </template>
      <template #cell_ip="scope">
        <a-tooltip :title="scope.row.ip" placement="topLeft">
          {{ scope.row.ip }}
        </a-tooltip>
      </template>
      <template #cell_location="scope">
        <a-tooltip :title="scope.row.location" placement="topLeft">
          {{ scope.row.location }}
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>
