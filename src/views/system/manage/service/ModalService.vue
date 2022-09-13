<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    :min-height="300"
    width="55%"
  >
    <BasicForm @register="registerForm" style="padding-right: 10px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { serviceFormSchema } from './service.data';
  import { getById, insert, update } from '/@/api/modules/system/manage/manageService';

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const id = ref('');
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 160,
    schemas: serviceFormSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      id.value = data.id;
      const detailData = await getById(id.value);
      setFieldsValue({
        ...detailData,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增服务' : '编辑服务'));

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      try {
        if (unref(isUpdate)) {
          await update(values, id.value);
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
        values: { ...values, id: id.value },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
