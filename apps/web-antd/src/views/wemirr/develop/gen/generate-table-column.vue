<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import { useFsAsync, useFsRef, utils } from '@fast-crud/fast-crud';
import { message } from 'ant-design-vue';

import { defHttp } from '#/api/request';

import createCrudOptions from './generate-table-column-crud';

export default defineComponent({
  name: 'EditableFree',
  setup() {
    const { crudRef, crudBinding, crudExpose, context } = useFsRef();

    // 页面打开后获取列表数据
    onMounted(async () => {
      await useFsAsync({
        crudBinding,
        crudRef,
        crudExpose,
        context,
        createCrudOptions,
      });

      await crudExpose.doRefresh();
      // await crudExpose.editable.enable({ mode: "free" });
    });

    return {
      crudBinding,
      crudRef,
      active() {
        crudExpose.editable.active({});
      },
      inactive() {
        crudExpose.editable.inactive();
      },
      async save() {
        const res = await crudExpose.editable.validate();
        if (res !== true) {
          console.error('validate error:', res);
          message.error(`validate error：${JSON.stringify(res)}`);
          return;
        }
        await defHttp.put(
          '/suite/generate-table-column//batch/modify',
          crudBinding.value.data,
        );
        message.success(`保存成功`);
        await crudExpose.doRefresh();
      },
      async editRestore() {
        await crudExpose.doRefresh();
      },
      log() {
        utils.logger.info(
          'table data:',
          crudBinding.value.data,
          crudExpose.getTableData(),
        );
      },
      cancel() {
        crudExpose.editable.resume();
      },
      addRow() {
        crudExpose.editable.addRow();
      },
      editCol() {
        crudExpose.editable.activeCols({ cols: ['radio'] });
      },
    };
  },
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
        <!--      <fs-button class="ml-1" @click="addRow">添加行</fs-button>-->
        <a-radio-group
          v-model:value="crudBinding.table.editable.enabled"
          class="ml-5"
        >
          <a-radio-button :value="true">启用编辑</a-radio-button>
          <a-radio-button :value="false">退出编辑</a-radio-button>
        </a-radio-group>
        <!-- <a-radio-group v-model:value="crudBinding.table.editable.showAction" class="ml-1">
          <a-radio-button :value="true">显示操作按钮</a-radio-button>
          <a-radio-button :value="false">不显示</a-radio-button>
        </a-radio-group> -->

        <template v-if="crudBinding.table.editable.enabled">
          <fs-button class="ml-5" @click="save">保存</fs-button>
        </template>
        <template v-else>
          <fs-button class="ml-5" @click="editRestore">复原</fs-button>
        </template>
      </template>
    </fs-crud>
  </fs-page>
</template>
