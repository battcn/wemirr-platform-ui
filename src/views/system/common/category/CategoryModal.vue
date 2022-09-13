<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="47%"
  >
    <BasicForm @register="registerForm" style="padding-right: 10px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './category.data';
  import { insert, update } from '/@/api/modules/system/rbac/rbacOrg';
  const isUpdate = ref(true);
  const orgId = ref('');
  const emit = defineEmits(['success', 'register']);
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      orgId.value = data.record.orgId;
      setFieldsValue({
        ...data.record,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增分类字典' : '编辑分类字典'));

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      try {
        if (unref(isUpdate)) {
          await update(values, orgId.value);
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
        values: { ...values, orgId: orgId.value },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
