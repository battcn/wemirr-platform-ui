<template>
  <PageWrapper @back="goBack" :title="data.title || '提交流程'" contentFullHeight>
    <a-card style="width: 100%; min-height: 73vh">
      <a-tabs v-model:activeKey="activeKey" @change="handleChangeTag">
        <a-tab-pane key="form" tab="基本信息" />
        <a-tab-pane key="attachment" tab="附件" />
        <a-tab-pane key="diagram" tab="流程图" />
        <template #tabBarExtraContent>
          <a-button
            type="primary"
            @click="handleSubmit"
            :loading="data.loading"
            :preIcon="data.loading ? '' : 'ant-design:thunderbolt-outlined'"
            >提交</a-button
          >
        </template>
      </a-tabs>
      <div v-show="activeKey == 'form'"> 表单 </div>
      <div v-show="activeKey == 'attachment'" class="submit-attachment">
        <Form :model="attachmentInfo" v-bind="layout">
          <FormItem name="remark" label="附件内容说明">
            <Textarea v-model:value="attachmentInfo.remark" />
          </FormItem>
          <FormItem name="attachments" label="附件信息">
            <Upload
              :action="getUploadAction()"
              v-model:file-list="attachmentInfo.attachments"
              :headers="getUploadHeaders()"
              @change="handleChange"
              name="file"
            >
              <a-button>
                <UploadOutlined />
                点击选择附件上传
              </a-button>
            </Upload>
          </FormItem>
        </Form>
      </div>
      <div v-show="activeKey == 'diagram'">
        <SkillFullBpmnPreview ref="bpmnPreviewDomRef" :high-margin="370" />
      </div>
    </a-card>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Form, FormItem, Upload, Input } from 'ant-design-vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { PageWrapper } from '/@/components/Page';
  import { message } from 'ant-design-vue';
  import { SkillFullBpmnPreview } from 'skillfull-process-pro-antvue';
  import { ref, reactive, nextTick, onMounted } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { getUploadAction, getUploadHeaders } from '/@/api/modules/storage/storageInfoFile';
  import { getDeploymentDetail } from '/@/api/modules/process/manage/definitionManage';
  import { submitProcess } from '/@/api/modules/process/business/processBusiness';
  import { useRoute, useRouter } from 'vue-router';
  import type { UploadChangeParam } from 'ant-design-vue';
  const route = useRoute();
  const Textarea = Input.TextArea;
  const bpmnPreviewDomRef = ref();
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const router = useRouter();
  const { closeCurrent } = useTabs();
  const activeKey = ref('form');
  const params = reactive(route.query as any);
  const data = reactive({
    title: '提交流程',
    diagramData: '',
    loading: false,
  });
  const formData = reactive({});
  const attachmentInfo = reactive({
    remark: '',
    attachments: [] as any[],
  });
  function goBack() {
    closeCurrent();
    router.back();
  }
  async function handleInitData() {
    const diagramInfo = await getDeploymentDetail(params.processDefinitionKey);
    data.title = '提交' + diagramInfo.deploymentName + '申请';
    data.diagramData = diagramInfo.diagramData;
  }
  function handleChangeTag(key: string) {
    activeKey.value = key;
    if (key == 'diagram') {
      nextTick(() => {
        bpmnPreviewDomRef.value.viewBase64Bpmn(data.diagramData);
      });
    }
  }
  async function handleSubmit() {
    try {
      data.loading = true;
      const submitData = {
        processDefinitionKey: params.processDefinitionKey,
        requireCallback: false,
      };
      if (attachmentInfo.attachments.length > 0) {
        const attachments: any[] = [];
        attachmentInfo.attachments.forEach((item) => {
          if (item.response) {
            attachments.push(item.response.data);
          }
        });
        const attachmentData = {
          remark: attachmentInfo.remark,
          attachments: attachments,
        };
        submitData['attachmentInfo'] = attachmentData;
      }
      await submitProcess(submitData);
      goBack();
    } finally {
      data.loading = false;
    }
  }
  function handleChange(info: UploadChangeParam) {
    if (info.file.status === 'done') {
      const response = info.file?.response;
      if (response && response.success) {
        message.success(`${info.file.name} 文件上传成功`);
      } else {
        message.error(`${info.file.name} 文件上传失败:${response.message}`);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.${info.file?.response.message}`);
    }
  }
  onMounted(() => {
    handleInitData();
  });
</script>

<style lang="less">
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  @import 'bpmn-js/dist/assets/bpmn-js.css';
  @import 'bpmn-js/dist/assets/diagram-js.css';
  @import 'diagram-js-minimap/assets/diagram-js-minimap.css';

  .skillfull-bpmn-preview {
    background-color: @component-background !important;
  }

  .skillfull-bpmn-preview-content-diagram {
    overflow-y: hidden !important;
  }

  .submit-attachment {
    margin-top: 20px;
  }
</style>
