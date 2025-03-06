<template>
  <Modal
    :open="visible"
    title="代码生成模板配置"
    :footer="null"
    width="80%"
    height="100%"
    @cancel="handleCancel"
    @update:open="handleCancel"
  >
    <div style="display: flex; height: 100%">
      <div style="width: 30%; padding: 16px">
        <Form :model="form" layout="vertical" ref="formRef">
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
        <!-- <CodeEditor
          v-model="form.code"
          theme="darcula"
          mode="velocity"
          height="700"
        ></CodeEditor> -->
        <CdeEditorMi v-model:command="form.code"  :readOnly=props.isViewMode
        :height="700" ></CdeEditorMi>
      </div>
    </div>
    <div>
      <Button type="primary" @click="handleSave" v-if="!props.isViewMode"
        >提交</Button
      >
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps } from 'vue';
import { Modal, Form, Input, Button } from 'ant-design-vue';
import { defHttp } from '#/api/request';
import  CdeEditorMi from './code-edtior-mi.vue'
const props = defineProps<{
  visible: boolean;
  templateId?: string;
  isViewMode?: boolean;
  onClose: () => void;
  onSave: (form: {
    id: number;
    path: string;
    name: string;
    description: string;
    content: string;
  }) => void;
  onEdit: (form: {
    id: number;
    path: string;
    name: string;
    description: string;
    content: string;
  }) => void;
}>();

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
    const res = await defHttp.get(
      `/suite/gennerate-template/${templateId}/detail`,
    );
    const data = res;
    form.value = {
      id: data.id,
      generatePath: data.generatePath,
      name: data.name,
      description: data.description,
      code: data.code,
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
        props.onEdit(form.value);
      } else {
        props.onSave(form.value);
      }
      // 重置表单 【解决代码编辑器内容清空异常问题】
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
  props.onClose();
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

<style scoped>
.ant-modal-body {
  padding: 0;
}
</style>
