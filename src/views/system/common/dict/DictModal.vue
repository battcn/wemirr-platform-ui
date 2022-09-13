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
  import { insert, update } from '/@/api/modules/system/common/commonDict';
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const rowId = ref('');

  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: [
      {
        field: 'dictName',
        label: '字典名称',
        component: 'Input',
        required: true,
      },
      {
        field: 'dictType',
        label: '字典类型',
        component: 'RadioButtonGroup',
        defaultValue: 0,
        required: true,
        componentProps: {
          options: [
            { label: '字符', value: 0 },
            { label: '数字', value: 1 },
            { label: '布尔', value: 2 },
          ],
        },
      },
      {
        field: 'dictCode',
        label: '字典编码',
        required: true,
        component: 'Input',
      },
      {
        field: 'dictStatus',
        label: '字典状态',
        required: true,
        component: 'RadioButtonGroup',
        defaultValue: 0,
        componentProps: {
          options: [
            { label: '禁用', value: 0 },
            { label: '启用', value: 1 },
          ],
        },
      },
      {
        label: '备注',
        field: 'remark',
        component: 'InputTextArea',
      },
    ],
    showActionButtonGroup: false,
    baseColProps: { lg: 24, md: 24 },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      rowId.value = data.record.dictId;
      setFieldsValue({
        ...data.record,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增字典' : '编辑字典'));

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      try {
        if (unref(isUpdate)) {
          await update(values, rowId.value);
        } else {
          await insert(values);
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
