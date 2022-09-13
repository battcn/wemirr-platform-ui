<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="34%"
  >
    <BasicForm @register="registerForm" style="padding-right: 10px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { itemFormSchema } from './dict.data';
  import { insertItem, updateItem } from '/@/api/modules/system/common/commonDict';
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const rowId = ref('');
  const dictId = ref('');

  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: itemFormSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 24, md: 24 },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    dictId.value = data.id;
    if (unref(isUpdate)) {
      rowId.value = data.record.itemId;
      dictId.value = data.record.dictId;
      setFieldsValue({
        ...data.record,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增字典项' : '编辑字典项'));
  async function handleSubmit() {
    try {
      const values = await validate();
      values.dictId = dictId.value;
      setModalProps({ confirmLoading: true });
      try {
        if (unref(isUpdate)) {
          await updateItem(values, rowId.value);
        } else {
          await insertItem(values);
        }
      } catch (error) {
        console.warn(error);
        return;
      }
      closeModal();
      emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
