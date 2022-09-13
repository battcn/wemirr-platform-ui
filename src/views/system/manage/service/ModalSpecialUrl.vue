<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    :min-height="300"
    width="45%"
  >
    <BasicForm @register="registerForm" style="padding-right: 10px">
      <template #requestMethod="{ model, field }">
        <a-select
          v-model:value="model[field]"
          placeholder="请选择请求方式"
          style="width: 100%"
          mode="multiple"
          :options="requestMethods"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { createSystemFormSchema } from './service.data';
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const enableUrlType = ref(3);
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 110,
    schemas: createSystemFormSchema(enableUrlType),
    showActionButtonGroup: false,
  });
  const requestMethods = reactive([
    { label: 'GET', value: 'GET' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
    { label: 'POST', value: 'POST' },
  ]);
  const urlData = ref({});
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    console.log('-----data--', data);
    enableUrlType.value = data?.enableUrlType || 3;
    if (unref(isUpdate)) {
      urlData.value = data.data;
      if (urlData.value['requestMethod']) {
        urlData.value['requestMethod'] = urlData.value['requestMethod'].split(',');
      } else {
        urlData.value['requestMethod'] = [];
      }
      setFieldsValue({
        ...urlData.value,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增url' : '编辑url'));

  async function handleSubmit() {
    const waitUpdateValue = await validate();
    if (!urlData.value['specialUrlId']) {
      waitUpdateValue['specialUrlId'] = Date.now();
    } else {
      waitUpdateValue['specialUrlId'] = urlData.value['specialUrlId'];
    }
    closeModal();
    const values = { ...waitUpdateValue };
    if (values['requestMethod']) {
      values['requestMethod'] = values['requestMethod'].toString();
    }
    emit('success', {
      values,
    });
  }
</script>
