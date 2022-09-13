<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="55%"
  >
    <BasicForm @register="registerForm" style="padding-right: 10px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { createClientFormSchema } from './client.data';
  import { getById, insert, update } from '/@/api/modules/system/rbac/rbacClientDetails';

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const clientDetailId = ref('');
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 160,
    schemas: createClientFormSchema(isUpdate),
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      clientDetailId.value = data.clientDetailId;
      const detailData = await getById(clientDetailId.value);
      if (detailData.scopes) {
        detailData.scopes = detailData.scopes;
      }
      setFieldsValue({
        ...detailData,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增系统' : '编辑系统'));

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      try {
        if (unref(isUpdate)) {
          await update(values, clientDetailId.value);
        } else {
          await insert(values);
        }
      } catch (error) {
        console.warn(error);
        return;
      }
      closeModal();
      emit('success', {
        isUpdate: unref(isUpdate),
        values: { ...values, clientDetailId: clientDetailId.value },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
