<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="45%"
  >
    <BasicForm @register="registerForm" style="padding-right: 30px; padding-left: 30px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { categoryFormSchema } from './category.data';
  import { insert, update } from '/@/api/modules/process/base/processCategory';

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const categoryId = ref('');
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 110,
    schemas: categoryFormSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      categoryId.value = data?.value?.categoryId;
      setFieldsValue({
        ...data?.value,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增类别' : '编辑类别'));

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      try {
        if (unref(isUpdate)) {
          await update(values, categoryId.value);
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
        values: { ...values, categoryId: categoryId.value },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
