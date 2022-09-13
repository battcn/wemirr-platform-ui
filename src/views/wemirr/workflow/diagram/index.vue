<template>
  <div>
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleToDesign('')"
          >新建模型</a-button
        >
        <a-button color="warning" preIcon="ant-design:cloud-upload-outlined" @click="handleImport"
          >导入</a-button
        >
        <a-button color="success" preIcon="ant-design:cloud-download-outlined" @click="handleExport"
          >导出</a-button
        >
      </template>
      <template #form-category="{ model, field }">
        <a-select
          v-model:value="model[field]"
          style="width: 100%"
          allowClear
          placeholder="请选择流程类别"
          :options="
            categoryList.map((item) => ({ value: item.categoryCode, label: item.categoryName }))
          "
        />
      </template>
      <template #processDefinitionKeys="{ record }">
        <span>
          <CopyOutlined
            class="copy-class"
            @click="copyInfo(record.processDefinitionKeys)"
            v-if="record.processDefinitionKeys"
          />
          {{ record.processDefinitionKeys || '' }}
        </span>
      </template>
      <template #modelState="{ record }">
        <a-badge status="processing" v-if="record.modelState == 1" text="已经部署" />
        <a-badge
          status="default"
          v-else-if="record.modelState == 2"
          color="gold"
          text="新版本待部署"
        />
        <a-badge status="default" v-else text="未部署" />
      </template>
      <template #headerTop>
        <Alert type="info" show-icon>
          <template #message>
            <div style="display: flex">
              <div style="margin-right: 20px; font-weight: 450">
                <span style="margin-right: 5px">未部署:</span>
                <span class="text-yellow-600">{{ statInfo.noDeployment }}</span>
              </div>
              <div style="margin-right: 20px; font-weight: 450">
                <span style="margin-right: 5px">已部署:</span>
                <span class="text-blue-400">{{ statInfo.deployment }}</span>
              </div>
              <div style="margin-right: 20px; font-weight: 450">
                <span style="margin-right: 5px">新版本待部署:</span>
                <span class="text-green-400">{{ statInfo.newVersion }}</span>
              </div>
            </div>
          </template>
        </Alert>
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              label: '编辑',
              icon: 'clarity:note-edit-line',
              tooltip: '编辑',
              onClick: handleToDesign.bind(null, record.modelId),
            },
            {
              label: '预览',
              icon: 'ant-design:eye-outlined',
              tooltip: '预览',
              onClick: handleView.bind(null, record.modelId),
            },
            {
              label: '部署',
              icon: 'ant-design:node-expand-outlined',
              tooltip: '部署',
              ifShow: () => record.modelState !== 1,
              onClick: handleDeployment.bind(null, record.modelId),
            },
            {
              label: '历史',
              icon: 'ant-design:bars-outlined',
              tooltip: '历史管理',
              onClick: handleHistoryDeployment.bind(null, record.modelId),
              ifShow: () => record.deploymentId,
            },
          ]"
          :dropDownActions="[
            {
              label: '复制',
              onClick: handleCopy.bind(null, record.modelId),
            },
            {
              label: '导出',
              onClick: handleView.bind(null, record.modelId),
            },
            {
              label: '删除',
              onClick: handleDelete.bind(null, record),
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
    <DiagramDeployment @register="registerDeploymentModal" width="34%" @success="handleReloadAll" />
    <DiagramDelete @register="deleteModal" width="34%" @success="handleReloadAll" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { SkillFullBpmnPreview } from 'skillfull-process-pro-antvue';
  import DiagramDeployment from './DiagramDeployment.vue';
  import DiagramDelete from './DiagramDelete.vue';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { router } from '/@/router';
  import { columns, searchFormSchema } from './diagram.data';
  import { selectPage, statistics, getById } from '/@/api/modules/process/base/designModel';
  import type { DesignModelDeploymentStatiDto } from '/@/api/modules/process/base/model/designModelModel';
  import { getList } from '/@/api/modules/process/base/processCategory';
  import { ProcessCategoryDto } from '/@/api/modules/process/base/model/processCategoryModel';
  import { Alert } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  const { createMessage } = useMessage();
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const [registerPreviesModal, { openModal: openPreviewModal }] = useModal();
  const [registerDeploymentModal, { openModal: openModelDeploymentModal }] = useModal();
  const [deleteModal, { openModal: openDeleteModal }] = useModal();
  const categoryList = ref<ProcessCategoryDto[]>([]);
  const searchInfo = reactive<Recordable>({});
  const bpmnPreviewTitle = ref('');
  const bpmnPreviewDomRef = ref();
  const statInfo = ref<DesignModelDeploymentStatiDto>({
    noDeployment: 0,
    deployment: 0,
    newVersion: 0,
  });
  const [registerTable, { reload }] = useTable({
    title: '模型列表',
    api: selectPage,
    rowKey: 'modelId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    useSearchForm: true,
    indexColumnProps: {
      width: 70,
    },
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    bordered: true,
    actionColumn: {
      width: 320,
      title: '操作',
      align: 'left',
      fixed: 'right',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  async function getCategory() {
    categoryList.value = await getList({ categoryState: 1 });
  }
  async function handleCopy(modelId: string) {
    router.push({
      name: 'FixedPageModelDesign',
      query: {
        modelId: modelId ? modelId : '',
        isCopy: 'true',
      },
    });
  }
  function handleDelete(record: any) {
    openDeleteModal(true, { ...record });
  }
  async function handleView(modelId: string) {
    const data = await getById(modelId);
    bpmnPreviewTitle.value = data.diagramNames;
    openPreviewModal(true);
    nextTick(() => {
      bpmnPreviewDomRef.value.viewBase64Bpmn(data.diagramData);
    });
  }
  function handleReloadAll() {
    reload();
    getModelStat();
  }
  async function getModelStat() {
    const data = await statistics();
    statInfo.value = data;
  }
  async function handleDeployment(modelId: string) {
    openModelDeploymentModal(true, {
      modelId: modelId,
    });
  }
  function handleToDesign(modelId?: string) {
    router.push({
      name: 'FixedPageModelDesign',
      query: {
        modelId: modelId ? modelId : '',
      },
    });
  }
  function handleHistoryDeployment(modelId: string) {
    router.push({
      name: 'FixedPageHistoryDeployment',
      query: {
        modelId: modelId,
      },
    });
  }
  function handleImport() {}
  function handleExport() {}
  function copyInfo(info: any) {
    clipboardRef.value = info;
    if (copiedRef.value) {
      createMessage.success('复制成功');
    }
  }
  onMounted(() => {
    getCategory();
    getModelStat();
  });
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
