<script lang="ts" setup>
import type { ApprovalStep } from './data';

import type { Ref } from 'vue';
import { h, ref } from 'vue';

import { CheckCircleTwoTone } from '@ant-design/icons-vue';
import { useColumns } from '@fast-crud/fast-crud';
import { useUi } from '@fast-crud/ui-interface';
import { Col as ACol, Row as ARow, Step, Steps } from 'ant-design-vue';
import dayjs from 'dayjs';

import createApprovalOptions from '#/views/wemirr/bpm/task/complete/approval';
import TaskFormDetail from '#/views/wemirr/bpm/task/complete/TaskFormDetail.vue';
import createTransferOptions from '#/views/wemirr/bpm/task/complete/transfer';

import * as api from './api';

const { ui } = useUi();

const dialogShow = ref(false);
const isPreview = ref(false);
const rowRef = ref();
const processId = ref();
const stepNodes: Ref<ApprovalStep[]> = ref([]);
const crudExposeRef = ref();
const title = ref();
function openPreview(row: any, crudExpose: any, preview: boolean) {
  dialogShow.value = true;
  processId.value = row.procInstId;
  rowRef.value = row;
  title.value = row.procInstName;
  crudExposeRef.value = crudExpose;
  isPreview.value = preview;
  api.GetTaskApprovalRecord(row.procInstId).then((ret) => {
    stepNodes.value = ret || [];
  });
}

const formApprovalWrapperRef = ref();
const formApprovalWrapperOptions = ref();

function openApprovalFormWrapper(type: number) {
  const { buildFormOptions } = useColumns();
  const { crudOptions } = createApprovalOptions({
    taskId: rowRef.value.procTaskId,
    type,
    crudExposeRef,
    dialogShow,
  });
  formApprovalWrapperRef.value = buildFormOptions(crudOptions);
  formApprovalWrapperRef.value.title =
    type === 0
      ? `评论 [ ${rowRef.value.procInstName} ] `
      : `审批 [ ${rowRef.value.procInstName} ] `;
  formApprovalWrapperOptions.value.open(formApprovalWrapperRef.value);
}

const formTransferWrapperRef = ref();
const formTransferWrapperOptions = ref();

function openTransferFormWrapper(type: number) {
  const { buildFormOptions } = useColumns();
  const { crudOptions } = createTransferOptions({
    taskId: rowRef.value.procTaskId,
    type,
    crudExposeRef,
    dialogShow,
  });
  formTransferWrapperRef.value = buildFormOptions(crudOptions);
  formTransferWrapperRef.value.title =
    type === 0
      ? `转办 [ ${rowRef.value.procInstName} ] `
      : `委派 [ ${rowRef.value.procInstName} ] `;
  formTransferWrapperOptions.value.open(formTransferWrapperRef.value);
}

defineExpose({
  openPreview,
});
</script>

<template>
  <component
    :is="ui.dialog.name"
    v-if="dialogShow"
    v-model:[ui.dialog.visible]="dialogShow"
    :on-ok="openApprovalFormWrapper"
    :title="title"
    :width="1200"
    cancel-text="关闭"
    ok-text="审批"
  >
    <ARow :gutter="24">
      <ACol :span="16">
        <TaskFormDetail :process-id="processId" />
      </ACol>
      <ACol v-if="stepNodes.length > 0" :span="8">
        <div class="result-success__content">
          <Steps
            :current="stepNodes.length"
            :responsive="true"
            direction="vertical"
            size="small"
            status="error"
          >
            <template v-for="item in stepNodes" :key="item.id">
              <Step
                :icon="
                  item?.taskStatus !== 'cancel' ? h(CheckCircleTwoTone) : null
                "
                :status="
                  item?.taskStatus === 'cancel'
                    ? 'error'
                    : item.procInstStatus === 'done'
                      ? 'finish'
                      : 'process'
                "
                :title="item?.taskName"
              >
                <template #description>
                  <div class="pl-1.5 text-gray-500">
                    {{ item?.approverName }}
                  </div>
                  <div class="pl-1.5 text-gray-500">
                    {{ dayjs(item?.approverTime).format('YYYY-MM-DD HH:mm') }}
                  </div>
                  <div class="comment-content">{{ item?.remark }}</div>
                </template>
              </Step>
            </template>
          </Steps>
        </div>
      </ACol>
    </ARow>
    <template #footer>
      <component
        :is="ui.button.name"
        type="default"
        @click="dialogShow = false"
      >
        关闭
      </component>
      <component
        :is="ui.button.name"
        v-show="!isPreview"
        type="primary"
        @click="openApprovalFormWrapper(0)"
      >
        评论
      </component>
      <component
        :is="ui.button.name"
        v-show="!isPreview"
        type="primary"
        @click="openApprovalFormWrapper(1)"
      >
        审核
      </component>
      <!--      <component :is="ui.button.name" type="primary" @click="openFormWrapper(1)" v-show="!isPreview">委派</component>-->
      <component
        :is="ui.button.name"
        v-show="!isPreview"
        type="primary"
        @click="openTransferFormWrapper(0)"
      >
        转办
      </component>
    </template>
    <fs-form-wrapper
      ref="formApprovalWrapperOptions"
      v-bind="formApprovalWrapperRef"
    />
    <fs-form-wrapper
      ref="formTransferWrapperOptions"
      v-bind="formTransferWrapperRef"
    />
  </component>
</template>

<style lang="less" scoped>
.result-success {
  padding: 48px 32px;
  //background-color: @component-background;

  &__content {
    padding: 24px 40px;
    //background-color: @background-color-light;
  }
}
.comment-content {
  user-select: none;
  margin-top: 4px;
  padding: 8px;
  border-radius: 4px;
  background-color: var(--el-bg-color-page);
}
</style>
