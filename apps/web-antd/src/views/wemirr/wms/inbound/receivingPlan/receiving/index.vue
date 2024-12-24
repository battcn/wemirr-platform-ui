<script lang="ts" setup>
import { nextTick, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';
import { message, Modal } from 'ant-design-vue';

import { defHttp } from '#/api/request';

import createCrudOptions from './crud';

// const selectedRowKeys = context.selectedRowKeys;
// 课时子表组件名称定义
defineOptions({
  name: 'AdvancedInDrawerClassTime',
});
const receivingRef = ref();
const selectedRowKeys = ref([{}]);
const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: { receivingRef, selectedRowKeys },
});
const drawerOpened = ref(false);

// 定义抽屉打开方法
const open = async ({ receivingRow }) => {
  receivingRef.value = receivingRow;
  drawerOpened.value = true;
  await nextTick(); // 等待crud初始化完成
  // 设置查询条件，只查询当前选中的教材id
  crudExpose.setSearchFormData({ form: { receivingPlanId: receivingRow.id } });
  // 刷新课时表
  await crudExpose.doRefresh();
};

const batchReceivingHandler = () => {
  if (selectedRowKeys.value?.length > 0) {
    const rows = crudBinding?.value?.data
      ?.filter((item) => selectedRowKeys.value.includes(item.id))
      .map((row) => {
        return { itemId: row.id, qty: row.platQty };
      });
    if (rows?.length === 0) {
      return message.error('请先勾选记录');
    }
    Modal.confirm({
      title: '确认',
      content: `确定要进行批量收货操作吗？`,
      async onOk() {
        await defHttp
          .post(
            `/wms/inbound/receiving-plans/${receivingRef.value.id}/receiving`,
            rows,
          )
          .then((ret) => {
            message.info('收货成功');
          });
        crudExpose.doRefresh();
        selectedRowKeys.value = [];
      },
    });
  } else {
    message.error('请先勾选记录');
  }
};

const allReceivingHandler = () => {
  Modal.confirm({
    title: '确认',
    content: `确定要进行全量收货操作吗？`,
    async onOk() {
      await defHttp
        .post(
          `/wms/inbound/receiving-plans/${receivingRef.value.id}/all_receiving`,
        )
        .then(() => {
          message.info('收货成功');
        });
      selectedRowKeys.value = [];
      await crudExpose.doRefresh();
    },
  });
};

// 暴露出去，父组件通过ref可以调用open方法
defineExpose({
  open,
});
</script>

<template>
  <a-drawer v-model:open="drawerOpened" title="收货" width="90%">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #actionbar-right>
        <fs-button
          icon="ph:barcode"
          type="primary"
          @click="batchReceivingHandler"
        >
          批量收货
        </fs-button>
        <fs-button
          icon="ph:barcode"
          style="margin-left: 3px"
          type="primary"
          @click="allReceivingHandler"
        >
          全量收货
        </fs-button>
      </template>
    </fs-crud>
  </a-drawer>
</template>
