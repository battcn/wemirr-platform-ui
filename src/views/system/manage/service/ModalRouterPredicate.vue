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
      <a-form :label-col="labelCol" :model="routerPredicatInfo.predicatInfo" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="断言名称"
              name="predicateName"
              :rules="[
                {
                  required: true,
                  message: '请输入断言名称',
                  trigger: ['change', 'blur'],
                },
              ]"
            >
              <a-input
                v-model:value="routerPredicatInfo.predicatInfo.predicateName"
                allowClear
                placeholder="请输入断言名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="断言类型"
              name="predicateType"
              :rules="[
                {
                  required: true,
                  message: '请选择断言类型',
                  trigger: ['change', 'blur'],
                },
              ]"
            >
              <a-select
                style="width: 100%"
                placeholder="请选择断言类型"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                @change="handlePredicateChange"
                v-model:value="routerPredicatInfo.predicatInfo.predicateType"
                :options="
                  routerPredicatInfo.predicateSysTypess.map((item) => ({
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
                v-model:value="routerPredicatInfo.predicatInfo.remark"
                allowClear
                placeholder="请输入备注"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div>
      <a-divider dashed style="border-color: #7cb305">断言规则</a-divider>
      <BasicForm @register="registerForm" style="padding-right: 10px" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, reactive, onMounted, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { columnJson } from './predicate.data';
  import { getListByConstantTypes } from '/@/api/modules/system/common/commonConstant';
  const emit = defineEmits(['success', 'register']);
  const labelCol = reactive({ span: 8 });
  const isUpdate = ref(true);
  const formRef = ref();
  const routerPredicatInfo = reactive({
    predicatInfo: {},
    predicateSysTypess: [],
    predicateSysTypesMap: {},
  });
  const [registerForm, { resetSchema, validateFields, resetFields, setFieldsValue }] = useForm({
    labelWidth: 130,
    schemas: [],
    showActionButtonGroup: false,
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    formRef.value.resetFields();
    resetFields();
    routerPredicatInfo.predicatInfo = {};
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      routerPredicatInfo.predicatInfo = { ...data.data };
      if (routerPredicatInfo.predicatInfo.predicateType) {
        nextTick(() => {
          handlePredicateChange();
          const rules = routerPredicatInfo.predicatInfo.rules;
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
  const getTitle = computed(() => (!unref(isUpdate) ? '新增断言' : '编辑断言'));
  async function handleSubmit() {
    try {
      const values = await formRef.value.validate();
      console.log('----values-----', values);
      const rules = await validateFields();
      if (!routerPredicatInfo.predicatInfo['predicateId']) {
        values['predicateId'] = Date.now();
      } else {
        values['predicateId'] = routerPredicatInfo.predicatInfo['predicateId'];
      }
      values['predicateTypeName'] =
        routerPredicatInfo.predicateSysTypesMap[values.predicateType].typeDescribe;
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
    routerPredicatInfo.predicateSysTypess = await getListByConstantTypes(
      'gateway-service:PredicateSysType',
    );
    const predicateSysTypesMap = {};
    routerPredicatInfo.predicateSysTypess.map((item) => {
      predicateSysTypesMap[item.type] = item;
    });
    routerPredicatInfo.predicateSysTypesMap = predicateSysTypesMap;
  }
  function handlePredicateChange() {
    resetFields();
    const predicateType = routerPredicatInfo.predicatInfo.predicateType;
    if (predicateType) {
      resetSchema(columnJson[predicateType] || []);
    } else {
      resetSchema([]);
    }
  }
  onMounted(() => {
    getFilterTypes();
  });
</script>
