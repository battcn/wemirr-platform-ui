<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    destroyOnClose
    :title="getTitle"
    @ok="handleSubmit"
    width="47%"
    :min-height="370"
  >
    <BasicForm @register="registerForm" style="padding-right: 20px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { createFormSchemas } from './menu.data';
  import { getMenuTree, getById, insert, update } from '/@/api/modules/system/rbac/rbacMenu';
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(false);
  const menuId = ref('');
  const parentType = ref<any>(null);
  const parentId = ref<any>(null);
  const systemId = ref('');
  const apiGetMenuTree = (params: {
    menuType: string | undefined;
    status: number | undefined;
    systemId: string;
  }) => {
    return getMenuTree(params.menuType as string, params.systemId, params.status);
  };
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 120,
    schemas: createFormSchemas(apiGetMenuTree, isUpdate, systemId, parentType, parentId),
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    parentType.value = null;
    parentId.value = null;
    isUpdate.value = !!data?.isUpdate;
    systemId.value = data?.systemId;
    menuId.value = data?.menuId;
    if (unref(isUpdate)) {
      const detailData = await getById(menuId.value);
      setFieldsValue({
        ...detailData,
      });
    } else {
      parentId.value = data?.parentId;
      parentType.value = data?.parentType;
      if (parentId.value) {
        const detailData = { parentId, menuType: parentType.value + 1 };
        setFieldsValue({
          ...detailData,
        });
      }
    }
  });
  const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

  async function handleSubmit() {
    try {
      const values = await validate();
      values.systemId = systemId.value;
      setModalProps({ confirmLoading: true });
      try {
        if (unref(isUpdate)) {
          await update(values, menuId.value);
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
        values: { ...values, menuId: menuId.value },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
