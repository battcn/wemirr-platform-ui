<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="45%"
  >
    <BasicForm @register="registerForm" style="padding-right: 10px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './role.data';
  import { getById, insert, update } from '/@/api/modules/system/rbac/rbacRole';

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const roleId = ref('');
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 90,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      roleId.value = data.roleId;
      const detailData = await getById(roleId.value);
      setFieldsValue({
        ...detailData,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      try {
        if (unref(isUpdate)) {
          await update(values, roleId.value);
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
        values: { ...values, roleId: roleId.value },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
