<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <CategoryList class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable
      @register="registerTable"
      class="w-3/4 xl:w-4/5"
      :searchInfo="searchInfo"
      @fetch-success="expandTableAll"
    >
      <template #processDefinitionKey="{ record }">
        <span>
          <CopyOutlined class="copy-class" @click="copyInfo(record.processDefinitionKey)" />
          {{ record.processDefinitionKey }}
        </span>
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'ant-design:select-outlined',
              label: '发起流程',
              color: 'success',
              auth: 'update',
              onClick: handleToSubmit.bind(null, record.processDefinitionKey),
            },
            {
              icon: 'ant-design:eye-outlined',
              label: '预览',
              onClick: handleView.bind(null, record.processDefinitionKey),
            },
          ]"
        />
      </template>
    </BasicTable>
    <BasicModal
      @register="registerPreviesModal"
      v-bind="$attrs"
      :canFullscreen="false"
      :title="bpmnPreviewTitle"
      :showCancelBtn="false"
      :showOkBtn="false"
      width="44%"
      :height="400"
    >
      <SkillFullBpmnPreview
        ref="bpmnPreviewDomRef"
        buttonPosition="top"
        size="small"
        useExternalHeight
        :externalHeight="340"
        :showMinimap="false"
      />
    </BasicModal>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive, nextTick, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    selectPageDefinition,
    getDeploymentDetail,
  } from '/@/api/modules/process/manage/definitionManage';
  import { router } from '/@/router';
  import { PageWrapper } from '/@/components/Page';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { SkillFullBpmnPreview } from 'skillfull-process-pro-antvue';
  import CategoryList from './CategoryList.vue';
  import { useModal, BasicModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { columns, searchFormSchema } from './market.data';
  const { createMessage } = useMessage();
  const [registerPreviesModal, { openModal: openPreviewModal }] = useModal();
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const searchInfo = reactive<Recordable>({ newVersion: true });
  const bpmnPreviewTitle = ref('');
  const bpmnPreviewDomRef = ref();
  const [registerTable, { reload, expandAll }] = useTable({
    title: '流程列表',
    api: selectPageDefinition,
    rowKey: 'processDefinitionId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    useSearchForm: true,
    bordered: true,
    canResize: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    indexColumnProps: {
      width: 80,
    },
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  function handleToSubmit(processDefinitionKey: string) {
    router.push({
      name: 'FixedPageSubmitProcess',
      query: {
        processDefinitionKey,
      },
    });
  }
  async function handleView(processDefinitionKey: string) {
    const data = await getDeploymentDetail(processDefinitionKey);
    bpmnPreviewTitle.value = data.deploymentName;
    openPreviewModal(true);
    nextTick(() => {
      bpmnPreviewDomRef.value.viewBase64Bpmn(data.diagramData);
    });
  }
  function expandTableAll() {
    nextTick(expandAll);
  }
  function copyInfo(info: any) {
    clipboardRef.value = info;
    if (copiedRef.value) {
      createMessage.success('复制成功');
    }
  }
  function handleSelect(categoryCode = '') {
    searchInfo.category = categoryCode;
    reload();
  }
</script>

<style lang="less">
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  @import 'bpmn-js/dist/assets/bpmn-js.css';
  @import 'bpmn-js/dist/assets/diagram-js.css';
  @import 'diagram-js-minimap/assets/diagram-js-minimap.css';

  .copy-class {
    color: @primary-color;
    cursor: pointer;
  }

  .skillfull-bpmn-preview {
    background-color: @component-background !important;
  }

  .skillfull-bpmn-preview-content-diagram {
    overflow-y: hidden !important;
  }
</style>
