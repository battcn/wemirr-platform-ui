<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="删除模型" @ok="handleSubmit">
    <a-descriptions :column="2" style="padding-right: 10px; padding-left: 20px">
      <a-descriptions-item label="模型名称"> {{ modelInfo['diagramNames'] }}</a-descriptions-item>
      <a-descriptions-item label="当前版本"> {{ modelInfo['version'] }}</a-descriptions-item>
      <a-descriptions-item label="流程定义key">
        {{ modelInfo['processDefinitionKeys']?.toString() }}
      </a-descriptions-item>
    </a-descriptions>
    <a-divider />
    <BasicForm @register="registerForm" style="padding-right: 40px; padding-left: 20px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { deleteformSchema } from './diagram.data';
  import { deleteByModel } from '/@/api/modules/process/base/designModel';
  const modelInfo = reactive({
    diagramNames: '',
    version: '',
    processDefinitionKeys: '',
    modelId: '',
  });
  const emit = defineEmits(['success', 'register']);
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: deleteformSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    modelInfo.diagramNames = data?.diagramNames || '';
    modelInfo.version = data?.version || '';
    modelInfo.processDefinitionKeys = data?.processDefinitionKeys || '';
    modelInfo.modelId = data?.modelId || '';
    setFieldsValue({
      ...data,
    });
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      values.modelId = modelInfo.modelId;
      setModalProps({ confirmLoading: true });
      try {
        await deleteByModel(values);
      } catch (error) {
        console.warn(error);
        return;
      }
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
