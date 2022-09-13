<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="发起流程"
    @ok="handleSubmit"
    width="47%"
  >
    <BasicForm @register="registerForm" style="padding-right: 20px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { submitFormSchema } from './market.data';
  import { getById, insert } from '/@/api/modules/system/rbac/rbacMenu';
  const isUpdate = ref(false);
  const deploymentId = ref('');
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 120,
    schemas: submitFormSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    deploymentId.value = data?.deploymentId;
    const detailData = await getById(deploymentId.value);
    setFieldsValue({
      ...detailData,
    });
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      values.deploymentId = deploymentId.value;
      if (values['actionMethods']) {
        values['actionMethods'] = values.actionMethods.toString();
      }
      setModalProps({ confirmLoading: true });
      try {
        await insert(values);
      } catch (error) {
        console.warn(error);
        return;
      }
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
