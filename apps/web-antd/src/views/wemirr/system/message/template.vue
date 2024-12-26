<script lang="ts" setup name="MessageTemplatePage">
import { onMounted, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import { createFormOptions } from './publish';
import createCrudOptions from './template';

const publishFormWrapperRef = ref();
const formWrapperOptions = ref();

function openPublishFormWrapper(row: any) {
  formWrapperOptions.value = createFormOptions();
  formWrapperOptions.value.initialForm = { code: row.code, name: row.name };
  publishFormWrapperRef.value.open(formWrapperOptions.value);
}

// 通过context传递到crud.tsx中
const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: { openPublishFormWrapper, permission: 'message:template' },
});

// 页面打开后获取列表数据
onMounted(async () => {
  await crudExpose.doRefresh();
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_content="scope">
        <a-tooltip :title="scope.row.content" placement="topLeft">
          {{ scope.row.content }}
        </a-tooltip>
      </template>
    </fs-crud>
    <fs-form-wrapper ref="publishFormWrapperRef" v-bind="formWrapperOptions">
      <template #form_slot="scope">
        <a-input v-model:value="scope.form.slot">
          <template #prefix>
            <fs-icon icon="ion:search" />
          </template>
        </a-input>
      </template>
    </fs-form-wrapper>
  </fs-page>
</template>
