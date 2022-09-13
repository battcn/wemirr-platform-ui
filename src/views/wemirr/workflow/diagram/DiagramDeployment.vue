<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="部署模型" @ok="handleSubmit">
    <a-descriptions :column="2" style="padding-right: 40px; padding-left: 20px">
      <a-descriptions-item label="模型名称"> {{ detailData['diagramNames'] }}</a-descriptions-item>
      <a-descriptions-item label="当前版本"> {{ detailData['version'] }}</a-descriptions-item>
      <a-descriptions-item label="流程id">
        {{ detailData['processDefinitionKeys']?.toString() || '' }}
      </a-descriptions-item>
    </a-descriptions>
    <a-divider />
    <BasicForm @register="registerForm" style="padding-right: 40px; padding-left: 20px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { formDeployment } from './diagram.data';
  import { getById } from '/@/api/modules/process/base/designModel';
  import { createDeployment } from '/@/api/modules/process/manage/definitionManage';
  const emit = defineEmits(['success', 'register']);
  const detailData = ref({});
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 90,
    schemas: formDeployment,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: true });
    detailData.value = await getById(data.modelId);
    detailData.value['deploymentName'] = detailData.value['diagramNames'];
    setFieldsValue({
      ...detailData.value,
    });
    setModalProps({ confirmLoading: false });
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      try {
        values.modelId = detailData.value['modelId'];
        await createDeployment(values);
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
