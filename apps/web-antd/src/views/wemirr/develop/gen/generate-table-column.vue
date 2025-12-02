<script lang="ts" setup>
import { onMounted } from 'vue';

import { useFs } from '@fast-crud/fast-crud';
import { message } from 'ant-design-vue';

import * as api from './generate-table-column-api';
import createCrudOptions from './generate-table-column-crud';

const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
});

const save = async () => {
  const res = await crudExpose.editable.validate();
  if (res !== true) {
    message.error(`validate error：${JSON.stringify(res)}`);
    return;
  }
  await api.BatchUpdate(crudBinding.value?.data || []);
  message.success(`保存成功`);
  await crudExpose.doRefresh();
};

const editRestore = async () => {
  await crudExpose.doRefresh();
};

// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_name="scope">
        <a-tooltip :title="scope.row.name" placement="top">
          {{ scope.row.name }}
        </a-tooltip>
      </template>
      <template #cell_tableName="scope">
        <a-tooltip :title="scope.row.tableName" placement="top">
          {{ scope.row.tableName }}
        </a-tooltip>
      </template>

      <template v-if="crudBinding" #actionbar-right>
        <a-radio-group
          v-if="crudBinding.table && crudBinding.table.editable"
          v-model:value="crudBinding.table.editable.enabled"
          class="ml-5"
        >
          <a-radio-button :value="true">启用编辑</a-radio-button>
          <a-radio-button :value="false">退出编辑</a-radio-button>
        </a-radio-group>

        <template
          v-if="
            crudBinding.table &&
            crudBinding.table.editable &&
            crudBinding.table.editable.enabled
          "
        >
          <fs-button class="ml-5" @click="save">保存</fs-button>
        </template>
        <template v-else>
          <fs-button class="ml-5" @click="editRestore">复原</fs-button>
        </template>
      </template>
    </fs-crud>
  </fs-page>
</template>
