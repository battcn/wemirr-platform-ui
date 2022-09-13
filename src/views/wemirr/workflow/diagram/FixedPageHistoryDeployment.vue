<template>
  <PageWrapper @back="goBack" :title="'历史部署' + `(${modeDetail['diagramNames']})`">
    <div>
      <BasicTable @register="registerTable" :searchInfo="searchInfo">
        <template #processDefinitionIds="{ record }">
          <span>
            <CopyOutlined class="copy-class" @click="copyInfo(record.processDefinitionIds)" />
            {{ record.processDefinitionIds && record.processDefinitionIds.toString() }}
          </span>
        </template>
        <template #processDefinitionKeys="{ record }">
          <span>
            <CopyOutlined class="copy-class" @click="copyInfo(record.processDefinitionKeys)" />
            {{ record.processDefinitionKeys }}
          </span>
        </template>
        <template #toolbar>
          <a-button
            color="success"
            preIcon="ant-design:cloud-download-outlined"
            @click="handleExport"
            >导出</a-button
          >
        </template>
        <template #haveRunTask="{ record }">
          <a-tag color="processing" v-if="record.active != 0 || record.suspended != 0">
            <template #icon>
              <SyncOutlined :spin="true" />
            </template>
            有任务
          </a-tag>
          <a-tag color="default" v-else>
            <template #icon>
              <ClockCircleOutlined />
            </template>
            无任务
          </a-tag>
        </template>
        <template #action="{ record }">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '预览',
                icon: 'ant-design:eye-outlined',
                tooltip: '预览',
                onClick: handleView.bind(null, record.historyModelId),
              },
              {
                label: '再次部署',
                icon: 'ant-design:node-expand-outlined',
                tooltip: '部署',
                onClick: handleDeployment.bind(null, record.historyModelId),
              },
            ]"
            :dropDownActions="[
              {
                label: '设置最新',
                onClick: handleSetNewVersion.bind(null, record.historyModelId),
              },

              {
                label: '复制',
                onClick: handleCopy.bind(null, record.historyModelId),
              },
              {
                label: '导出',
                onClick: handleView.bind(null, record.historyModelId),
              },
              {
                label: '删除',
                onClick: handleDelete.bind(null, record),
              },
            ]"
          />
        </template>
        <template #suspensionState="{ record }">
          <a-badge
            status="processing"
            v-if="record.suspended == 0 && record.active > 0"
            text="激活"
          />
          <a-badge status="error" v-else-if="record.suspended > 0" text="有挂起" />
          <a-badge status="default" v-else-if="record.totalNum == 0" text="无任务" />
          <a-badge status="warning" v-else text="完成或终止" />
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
      <DiagramHistoryDelete @register="deleteModal" width="34%" @success="handleReloadAll" />
      <DiagramDeploymentHistory
        @register="registerDeploymentModal"
        width="34%"
        @success="handleReloadAll"
      />
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { SyncOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';
  import { reactive, ref, onMounted, nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { SkillFullBpmnPreview } from 'skillfull-process-pro-antvue';
  import DiagramHistoryDelete from './DiagramHistoryDelete.vue';
  import DiagramDeploymentHistory from './DiagramDeploymentHistory.vue';
  import { historyDeployment } from '/@/api/modules/process/manage/definitionManage';
  import { PageWrapper } from '/@/components/Page';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute, useRouter } from 'vue-router';
  import { getById as getModelDetail } from '/@/api/modules/process/base/designModel';
  import { historyDeploymentColumns, searchHistoryDeploymentFormSchema } from './diagram.data';
  import { selectPage, getById } from '/@/api/modules/process/base/designModelHistory';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  const { notification, createMessage } = useMessage();
  const [registerPreviesModal, { openModal: openPreviewModal }] = useModal();
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const [deleteModal, { openModal: openDeleteModal }] = useModal();
  const route = useRoute();
  const router = useRouter();
  const { closeCurrent } = useTabs();
  const [registerDeploymentModal, { openModal: openModelDeploymentModal }] = useModal();
  const modelId = ref(route.query?.modelId as string);
  const modeDetail = ref({});
  const searchInfo = reactive<Recordable>({});
  const bpmnPreviewTitle = ref('');
  const bpmnPreviewDomRef = ref();
  searchInfo.modelId = modelId.value;
  const [registerTable, { reload }] = useTable({
    api: selectPage,
    rowKey: 'historyModelId',
    columns: historyDeploymentColumns,
    formConfig: {
      labelWidth: 120,
      schemas: searchHistoryDeploymentFormSchema,
      autoSubmitOnEnter: true,
    },
    indentSize: 10,
    useSearchForm: true,
    showTableSetting: true,
    canResize: true,
    indexColumnProps: {
      width: 70,
    },
    tableSetting: { fullScreen: true },
    bordered: true,
    actionColumn: {
      width: 210,
      title: '操作',
      align: 'left',
      fixed: 'right',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  async function handleCopy(historyModelId: string) {
    router.push({
      name: 'FixedPageModelDesign',
      query: {
        modelId: historyModelId,
        isCopy: 'true',
        history: 'true',
      },
    });
  }
  function handleDelete(record: any) {
    openDeleteModal(true, { ...record });
  }
  async function handleView(historyModelId: string) {
    const data = await getById(historyModelId);
    bpmnPreviewTitle.value = data.diagramNames;
    openPreviewModal(true);
    nextTick(() => {
      bpmnPreviewDomRef.value.viewBase64Bpmn(data.diagramData);
    });
  }
  async function handleSetNewVersion(historyModelId: string) {
    const data = await getById(historyModelId);
    const deploymentInfo = {
      deploymentName: data.diagramNames,
      deploymentId: data.deploymentId,
      historyModelId: data.historyModelId,
    };
    await historyDeployment(deploymentInfo);
    notification.success({
      message: '通知',
      description: '设置为有效版本成功',
      duration: 3,
    });
    reload();
  }
  function handleReloadAll() {
    reload();
  }
  async function handleDeployment(historyModelId: string) {
    openModelDeploymentModal(true, {
      historyModelId: historyModelId,
    });
  }
  async function getModelDetailInfo() {
    modeDetail.value = await getModelDetail(modelId.value);
  }
  function handleExport() {}
  function goBack() {
    closeCurrent();
    router.back();
  }
  function copyInfo(info: any) {
    clipboardRef.value = info;
    if (copiedRef.value) {
      createMessage.success('复制成功');
    }
  }
  onMounted(() => {
    getModelDetailInfo();
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
