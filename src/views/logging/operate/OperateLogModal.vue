<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" style="padding-right: 10px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { detailFormSchema } from './operatelog.data';
  import { getById, insert, update } from '/@/api/modules/system/rbac/rbacSystem';

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const systemId = ref('');
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 90,
    schemas: detailFormSchema,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      systemId.value = data.systemId;
      const detailData = await getById(systemId.value);
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
          await update(values, systemId.value);
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
        values: { ...values, systemId: systemId.value },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
