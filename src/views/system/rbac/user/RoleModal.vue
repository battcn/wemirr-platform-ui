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
  import { formSchema, ORG_ROLE_PREFIX } from './role.data';
  import { getById, insert, update } from '/@/api/modules/system/rbac/rbacOrgRole';

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const orgRoleId = ref('');
  const orgId = ref('');
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
    orgRoleId.value = data.orgRoleId;
    orgId.value = data.orgId;
    if (unref(isUpdate)) {
      orgRoleId.value = data.orgRoleId;
      const detailData = await getById(orgRoleId.value);
      if (detailData['roleCode'].indexOf(ORG_ROLE_PREFIX) != -1) {
        detailData['roleCode'] = detailData['roleCode'].substring(8, detailData['roleCode'].length);
      }
      setFieldsValue({
        ...detailData,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增机构角色' : '编辑机构角色'));

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      values['orgRoleId'] = orgRoleId.value;
      values['roleCode'] = ORG_ROLE_PREFIX + values['roleCode'];
      values['orgId'] = orgId.value;
      try {
        if (unref(isUpdate)) {
          await update(values, orgRoleId.value);
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
        values: { ...values, orgRoleId: orgRoleId.value },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
