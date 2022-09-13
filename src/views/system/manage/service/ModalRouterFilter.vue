<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    :min-height="300"
    width="45%"
  >
    <div style="padding-right: 10px">
      <a-form :label-col="labelCol" :model="routerFilterInfo.routerInfo" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="过滤器名称"
              name="filterName"
              :rules="[
                {
                  required: true,
                  message: '请输入过滤器名称',
                  trigger: ['change', 'blur'],
                },
              ]"
            >
              <a-input
                v-model:value="routerFilterInfo.routerInfo.filterName"
                allowClear
                placeholder="请输入过滤器名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="过滤器类型"
              name="filterType"
              :rules="[
                {
                  required: true,
                  message: '请选择过滤器类型',
                  trigger: ['change', 'blur'],
                },
              ]"
            >
              <a-select
                style="width: 100%"
                placeholder="请选择过滤器类型"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                @change="handleFilterTypeChange"
                v-model:value="routerFilterInfo.routerInfo.filterType"
                :options="
                  routerFilterInfo.filterSysTypes.map((item) => ({
                    value: item.type,
                    label: item.typeDescribe,
                  }))
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="备注" name="remark">
              <a-textarea
                v-model:value="routerFilterInfo.routerInfo.remark"
                allowClear
                placeholder="请输入备注"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div>
      <a-divider dashed style="border-color: #7cb305">过滤器规则</a-divider>
      <BasicForm @register="registerForm" style="padding-right: 10px" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, reactive, onMounted, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { columnJson } from './filter.data';
  import { getListByConstantTypes } from '/@/api/modules/system/common/commonConstant';
  const emit = defineEmits(['success', 'register']);
  const labelCol = reactive({ span: 8 });
  const isUpdate = ref(true);
  const formRef = ref();
  const routerFilterInfo = reactive({
    routerInfo: {},
    filterSysTypess: [],
    filterSysTypesMap: {},
  });
  const [registerForm, { resetSchema, validateFields, resetFields, setFieldsValue }] = useForm({
    labelWidth: 80,
    schemas: [],
    showActionButtonGroup: false,
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    formRef.value.resetFields();
    resetFields();
    setModalProps({ confirmLoading: false });
    routerFilterInfo.routerInfo = {};
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      routerFilterInfo.routerInfo = { ...data.data };
      if (routerFilterInfo.routerInfo.filterType) {
        nextTick(() => {
          handleFilterTypeChange();
          const rules = routerFilterInfo.routerInfo.rules;
          if (rules) {
            setFieldsValue({
              ...rules,
            });
          }
        });
      } else {
        resetSchema([]);
      }
    } else {
      resetSchema([]);
    }
  });
  const getTitle = computed(() => (!unref(isUpdate) ? '新增过滤器' : '编辑过滤器'));
  async function handleSubmit() {
    try {
      const values = await formRef.value.validate();
      const rules = await validateFields();
      if (!routerFilterInfo.routerInfo['filterId']) {
        values['filterId'] = Date.now();
      } else {
        values['filterId'] = routerFilterInfo.routerInfo['filterId'];
      }
      values['filterTypeName'] = routerFilterInfo.filterSysTypesMap[values.filterType].typeDescribe;
      values['rules'] = rules;
      closeModal();
      emit('success', {
        values,
      });
    } catch (__error) {
      try {
        await validateFields();
      } catch (__error2) {}
    }
  }
  async function getFilterTypes() {
    routerFilterInfo.filterSysTypes = await getListByConstantTypes('gateway-service:FilterSysType');
    const filterSysTypeMap = {};
    routerFilterInfo.filterSysTypes.map((item) => {
      filterSysTypeMap[item.type] = item;
    });
    routerFilterInfo.filterSysTypesMap = filterSysTypeMap;
  }
  function handleFilterTypeChange() {
    resetFields();
    const filterType = routerFilterInfo.routerInfo.filterType;
    if (filterType) {
      resetSchema(columnJson[filterType] || []);
    } else {
      resetSchema([]);
    }
  }
  onMounted(() => {
    getFilterTypes();
  });
</script>
