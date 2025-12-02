<script lang="ts" setup>
import { ref, watch } from 'vue';

import { Button, Form, Input, Modal } from 'ant-design-vue';

import * as api from '../generate-template-api';
import CdeEditorMi from './code-edtior-mi.vue';

const props = defineProps<{
  isViewMode?: boolean;
  templateId?: string | null;
  visible: boolean;
}>();

const emit = defineEmits(['close', 'save', 'edit', 'update:visible']);

const form = ref({
  id: '',
  generatePath: '',
  name: '',
  description: '',
  code: '',
});
const formRef = ref();
const isViewMode = ref(props.isViewMode || false);

const fetchTemplateData = async (templateId: string) => {
  try {
    const res = await api.GetDetail(templateId);
    form.value = {
      id: res.id,
      generatePath: res.generatePath,
      name: res.name,
      description: res.description,
      code: res.code,
    };
  } catch (error) {
    console.error('Failed to fetch template data:', error);
  }
};

const handleSave = () => {
  formRef.value
    .validate()
    .then(() => {
      if (props.templateId) {
        emit('edit', form.value);
      } else {
        emit('save', form.value);
      }
      // 重置表单
      form.value = {
        id: '',
        generatePath: '',
        name: '',
        description: '',
        code: '',
      };
    })
    .catch((error: any) => {
      console.error('Validation failed:', error);
    });
};

const handleCancel = () => {
  form.value = {
    id: '',
    generatePath: '',
    name: '',
    description: '',
    code: '',
  };
  emit('close');
  emit('update:visible', false);
};

watch(
  () => props.visible,
  (newVal) => {
    if (newVal && props.templateId) {
      fetchTemplateData(props.templateId);
    } else if (newVal) {
      form.value = {
        id: '',
        generatePath: '',
        name: '',
        description: '',
        code: '',
      };
    }
    isViewMode.value = props.isViewMode || false;
  },
);
</script>

<template>
  <Modal
    :open="visible"
    title="代码生成模板配置"
    :footer="null"
    width="80%"
    :destroy-on-close="true"
    style="top: 20px"
    @cancel="handleCancel"
  >
    <div style="display: flex; height: 75vh">
      <div style="width: 30%; padding: 16px">
        <Form ref="formRef" :model="form" layout="vertical">
          <Form.Item
            label="模板路径"
            name="generatePath"
            :rules="[{ required: true, message: '请输入模板路径' }]"
          >
            <Input.TextArea
              v-model:value="form.generatePath"
              placeholder="请输入模板路径"
              :disabled="props.isViewMode"
            />
          </Form.Item>
          <Form.Item
            label="模板名称"
            name="name"
            :rules="[{ required: true, message: '请输入模板名称' }]"
          >
            <Input
              v-model:value="form.name"
              placeholder="请输入模板名称"
              :disabled="props.isViewMode"
            />
          </Form.Item>
          <Form.Item label="模板描述" name="description">
            <Input.TextArea
              v-model:value="form.description"
              placeholder="请输入模板描述"
              :disabled="props.isViewMode"
            />
          </Form.Item>
        </Form>
      </div>
      <div style="width: 70%; padding: 16px; overflow: auto">
        <CdeEditorMi
          v-model:command="form.code"
          :read-only="props.isViewMode"
          :height="700"
        />
      </div>
    </div>
    <div class="footer-button">
      <Button v-if="!props.isViewMode" type="primary" @click="handleSave">
        提交
      </Button>
    </div>
  </Modal>
</template>

<style scoped>
.ant-modal-body {
  padding: 0;
}

.footer-button {
  padding: 10px 16px;
  text-align: right;
  border-top: 1px solid #f0f0f0;
}
</style>
