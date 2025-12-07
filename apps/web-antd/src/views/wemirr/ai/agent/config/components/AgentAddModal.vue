<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';

import { onMounted, reactive, ref, watch } from 'vue';

import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import * as api from '../api';

defineOptions({
  name: 'AgentAddModal',
});

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

interface Props {
  visible: boolean;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'success'): void;
}

const formRef = ref<FormInstance>();
const loading = ref(false);

// 表单数据
const formData = reactive({
  name: '',
  chatModelId: undefined as number | string | undefined,
  description: '',
  aiSystemMessage: '',
  avatar: '',
  kbId: undefined as number | string | undefined,
  tools: [] as string[],
});

// 表单验证规则
const rules = reactive({
  name: [{ required: true, message: '请输入智能体名称', trigger: 'blur' }],
  chatModelId: [
    { required: true, message: '请选择绑定模型', trigger: 'change' },
  ],
});

// 选项数据
const modelOptions = ref<Array<{ label: string; value: number | string }>>([]);
const modelLoading = ref(false);

const knowledgeBaseOptions = ref<
  Array<{ label: string; value: number | string }>
>([]);
const knowledgeBaseLoading = ref(false);

const toolOptions = ref<Array<{ label: string; value: string }>>([]);
const toolLoading = ref(false);

// 获取模型列表
const getModelList = async () => {
  modelLoading.value = true;
  try {
    const res = await api.getModelList();
    modelOptions.value = (res.records || []).map((item: any) => ({
      label: item.name || item.modelName, // 兼容处理，优先使用 name
      value: item.id,
    }));
  } catch (error) {
    console.error('获取模型列表失败:', error);
    message.error('获取模型列表失败');
  } finally {
    modelLoading.value = false;
  }
};

// 获取知识库列表
const getKnowledgeBaseList = async () => {
  knowledgeBaseLoading.value = true;
  try {
    const res = await api.getKnowledgeBaseList();
    knowledgeBaseOptions.value = (res.records || []).map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  } catch (error) {
    console.error('获取知识库列表失败:', error);
    message.error('获取知识库列表失败');
  } finally {
    knowledgeBaseLoading.value = false;
  }
};

// 获取工具列表
const getToolList = async () => {
  toolLoading.value = true;
  try {
    const res = await api.getTools();
    toolOptions.value = (res || []).map((item: any) => ({
      label: item.beanName,
      value: item.beanName,
    }));
  } catch (error) {
    console.error('获取工具列表失败:', error);
    message.error('获取工具列表失败');
  } finally {
    toolLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  // 先重置表单验证状态
  formRef.value?.resetFields();

  // 再重置表单数据
  Object.assign(formData, {
    name: '',
    chatModelId: undefined,
    description: '',
    aiSystemMessage: '',
    avatar: '',
    kbId: undefined,
    tools: [],
  });

  // 清除验证错误
  formRef.value?.clearValidate();
};

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    // 处理工具配置，转换为JSON字符串
    const submitData = {
      ...formData,
      tools: formData.tools.length > 0 ? JSON.stringify(formData.tools) : '',
    };

    await api.create(submitData);
    message.success('新增智能体成功');
    emit('success');
  } catch (error: any) {
    if (error.errorFields) {
      // 表单验证失败
      return;
    }
    console.error('新增智能体失败:', error);
    message.error('新增智能体失败');
  } finally {
    loading.value = false;
  }
};

// 取消
const handleCancel = () => {
  emit('update:visible', false);
};

// 头像上传相关
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的图片!');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小必须小于 2MB!');
    return false;
  }
  return true;
};

const handleUpload = async (options: any) => {
  const { file } = options;
  try {
    const res = await api.uploadAvatar(file);
    formData.avatar = res.url || res;
    message.success('头像上传成功');
  } catch (error) {
    console.error('头像上传失败:', error);
    message.error('头像上传失败');
  }
};

// 监听弹窗显示状态
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      resetForm();
    }
  },
);

onMounted(() => {
  getModelList();
  getKnowledgeBaseList();
  getToolList();
});
</script>

<template>
  <a-modal
    :visible="visible"
    title="新增智能体"
    width="800px"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="智能体名称" name="name">
        <a-input
          v-model:value="formData.name"
          placeholder="请输入智能体名称"
          :maxlength="50"
        />
      </a-form-item>

      <a-form-item label="绑定模型" name="chatModelId">
        <a-select
          v-model:value="formData.chatModelId"
          placeholder="请选择模型"
          allow-clear
          :options="modelOptions"
          :loading="modelLoading"
        />
      </a-form-item>

      <a-form-item label="描述" name="description">
        <a-textarea
          v-model:value="formData.description"
          placeholder="请输入智能体描述"
          :rows="3"
          :maxlength="500"
          show-count
        />
      </a-form-item>

      <a-form-item label="角色预设" name="aiSystemMessage">
        <a-textarea
          v-model:value="formData.aiSystemMessage"
          placeholder="请输入智能体的角色预设信息"
          :rows="4"
          :maxlength="2000"
          show-count
        />
      </a-form-item>

      <a-form-item label="头像" name="avatar">
        <div class="avatar-upload-wrapper">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :custom-request="handleUpload"
          >
            <img
              v-if="formData.avatar"
              :src="formData.avatar"
              alt="avatar"
              class="uploaded-avatar"
            />
            <div v-else class="upload-placeholder">
              <PlusOutlined />
              <div class="ant-upload-text">上传头像</div>
            </div>
          </a-upload>
        </div>
      </a-form-item>

      <a-form-item label="关联知识库" name="kbId">
        <a-select
          v-model:value="formData.kbId"
          placeholder="请选择知识库"
          allow-clear
          :options="knowledgeBaseOptions"
          :loading="knowledgeBaseLoading"
        />
      </a-form-item>

      <a-form-item label="工具配置" name="tools">
        <a-select
          v-model:value="formData.tools"
          mode="multiple"
          placeholder="请选择工具"
          allow-clear
          :options="toolOptions"
          :loading="toolLoading"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped>
:deep(.ant-form-item-label) {
  text-align: left;
}

.avatar-upload-wrapper {
  .avatar-uploader {
    .ant-upload {
      width: 104px;
      height: 104px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s ease;

      &:hover {
        border-color: #1890ff;
      }
    }
  }

  .uploaded-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #999;

    .anticon {
      font-size: 24px;
      margin-bottom: 8px;
    }
  }
}
</style>
