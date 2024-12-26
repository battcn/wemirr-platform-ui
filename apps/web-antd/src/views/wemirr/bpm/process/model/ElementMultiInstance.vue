<script lang="ts" setup>
import type { ModelerStore } from '@fast-crud/fast-bpmn';

import { computed, getCurrentInstance, nextTick, ref } from 'vue';
import type { Ref } from 'vue';

import { useModelerStore } from '@fast-crud/fast-bpmn';
import { dict } from '@fast-crud/fast-crud';
import { useUi } from '@fast-crud/ui-interface';
import { isArray } from 'ant-design-vue/es/_util/util';

import { getUserByIds } from '#/api/core/user';
import {
  comparisonOptions,
  completionConditionOptions,
  multiInstanceTypeOptions,
} from '#/views/wemirr/bpm/process/model/data';
import userCrudOptions from '#/views/wemirr/system/user/crud';

const { ui } = useUi();

const { injectModelerStore } = useModelerStore();
const modelerStore = injectModelerStore() as ModelerStore;
const { ctx: that } = getCurrentInstance() as any;
const element = computed(() => modelerStore!.getActive!);
const helper = modelerStore.helper;
const assigneeListFormData: Ref = ref();
const formData: Ref = ref({
  multiInstanceType: 'none',
  collection: undefined,
  elementVariable: undefined,
  completionCondition: undefined,
  comparison: undefined,
  comparisonVal: undefined,
});
const multiInstanceElementRef = ref();
const showConditionRef = ref();
const showComparisonRef = ref();
const showExpressionRef = ref();
const assigneeList: Ref = ref([]);

function vModeler(key: string) {
  const valueKey = key ? `value.${key}` : 'value';
  return {
    ref: formData,
    key: valueKey,
    onChange: (value: any) => {
      formData[key] = value;
      elementVisibility();
      setFormalExpression();
    },
  };
}
function elementVisibility() {
  if (
    formData.value.multiInstanceType === 'none' ||
    formData.value.multiInstanceType === undefined
  ) {
    multiInstanceElementRef.value = undefined;
    showConditionRef.value = false;
    showComparisonRef.value = false;
    showExpressionRef.value = false;
    formData.value.completionCondition = undefined;
    formData.value.elementVariable = undefined;
    formData.value.multiInstanceType = 'none';
    assigneeList.value = undefined;
  } else {
    showConditionRef.value = true;
    showComparisonRef.value = true;
    if (formData.value.completionCondition === 'all') {
      showComparisonRef.value = false;
      formData.value.comparison = undefined;
      formData.value.comparisonVal = undefined;
    }
    if (formData.value.completionCondition === 'expression') {
      showComparisonRef.value = false;
      showExpressionRef.value = true;
      formData.value.comparison = undefined;
      formData.value.comparisonVal = undefined;
    }
    switch (formData.value.completionCondition) {
      case 'all': {
        showExpressionRef.value = false;
        showComparisonRef.value = false;
        formData.value.comparison = undefined;
        formData.value.comparisonVal = undefined;

        break;
      }
      case 'expression': {
        showExpressionRef.value = true;
        showComparisonRef.value = false;
        formData.value.comparisonVal = undefined;

        break;
      }
      case 'number': {
        showExpressionRef.value = false;
        showComparisonRef.value = true;
        formData.value.comparison = formData.value.comparison || '==';
        formData.value.comparisonVal = formData.value.comparison || 1;

        break;
      }
      case 'percentage': {
        showExpressionRef.value = false;
        showComparisonRef.value = true;
        formData.value.comparison = formData.value.comparison || '==';
        formData.value.comparisonVal = formData.value.comparisonVal || 100;

        break;
      }
      // No default
    }
  }

  Object.entries(formData.value).forEach(([key, value]) => {
    const val = helper.getElementProperty(element.value, key, value, true);
    if (val !== value) {
      helper.setElementProperty(element.value, key, value, true);
    }
  });
}
modelerStore.onElementUpdate(async () => {
  Object.entries(formData.value).forEach(([key, value]) => {
    formData.value[key] = helper.getElementProperty(element.value, key, true);
  });
  console.log('onElementUpdate formData', formData.value);
  await nextTick();
  that.$forceUpdate();
  elementVisibility();
});

modelerStore.onElementUpdate(async () => {
  let assigneeProperty: any = helper.getElementProperty(
    element.value,
    'assigneeList',
    true,
  );
  if (assigneeProperty) {
    assigneeProperty = isArray(assigneeProperty)
      ? assigneeProperty
      : assigneeProperty.split(',');
  }
  assigneeList.value = assigneeProperty;
  await nextTick();
  that.$forceUpdate();
});

function assigneeListModeler(key: string) {
  const valueKey = key ? `value.${key}` : 'value';
  return {
    ref: assigneeListFormData,
    key: valueKey,
    onChange: (value: any) => {
      helper.setElementProperty(element.value, key, value, true);
      helper.setElementProperty(element.value, 'assignee', '${assignee}', true);
      setFormalExpression();
    },
  };
}

const loadDict = ref(
  dict({
    immediate: true,
    value: 'id',
    label: 'nickName',
    getNodesByValues: async (values: any[]) => {
      return await getUserByIds(values);
    },
  }),
);

const bpmnFactory = modelerStore.getModeler?.get('bpmnFactory');
const modeling = modelerStore.getModeling;

function setFormalExpression() {
  if (formData.value.multiInstanceType === 'none') {
    helper.setElementProperty(element.value, 'assignee', undefined, true);
    modeling.updateProperties(element.value, {
      loopCharacteristics: undefined,
    });
    return;
  }
  const isSequential = formData.value.multiInstanceType === 'sequential';
  multiInstanceElementRef.value = bpmnFactory.create(
    'bpmn:MultiInstanceLoopCharacteristics',
    {
      isSequential,
      collection: assigneeList.value
        ? `\${wp.toList(${assigneeList.value})}`
        : undefined,
      elementVariable: 'assignee',
    },
  );

  modeling.updateProperties(element.value, {
    loopCharacteristics: multiInstanceElementRef.value,
  });
  if (!multiInstanceElementRef.value) {
    return;
  }
  const expressionVal = [
    formData?.value.completionCondition,
    formData?.value.comparison,
    formData?.value.comparisonVal,
  ]
    .filter((value) => value !== null && value !== undefined && value !== '')
    .join('');
  switch (formData?.value.completionCondition) {
    case 'all':
    case undefined: {
      multiInstanceElementRef.value.completionCondition = bpmnFactory.create(
        'bpmn:FormalExpression',
        { body: '${nrOfCompletedInstances == nrOfInstances}' },
      );

      break;
    }
    case 'expression': {
      multiInstanceElementRef.value.completionCondition = bpmnFactory.create(
        'bpmn:FormalExpression',
        { body: formData?.value.comparisonVal },
      );

      break;
    }
    case 'number': {
      multiInstanceElementRef.value.completionCondition = bpmnFactory.create(
        'bpmn:FormalExpression',
        {
          body: `\${ nrOfCompletedInstances ${formData?.value.comparison} ${
            formData?.value.comparisonVal
          }}`,
        },
      );

      break;
    }
    case 'percentage': {
      multiInstanceElementRef.value.completionCondition = bpmnFactory.create(
        'bpmn:FormalExpression',
        {
          body: `\${ (nrOfCompletedInstances / nrOfInstances) * 100 ${
            formData?.value.comparison
          } ${formData?.value.comparisonVal}}`,
        },
      );

      break;
    }
    default: {
      multiInstanceElementRef.value.completionCondition = bpmnFactory.create(
        'bpmn:FormalExpression',
        { body: `\${${expressionVal}}` },
      );
    }
  }
}
</script>

<template>
  <component :is="ui.collapseItem.name" name="element-subdom-test">
    <template #header>
      <collapse-title title="多实例">
        <lucide-icon name="FileText" />
      </collapse-title>
    </template>
    <edit-item :label-width="100" label="类型">
      <component
        :is="ui.radioGroup.name"
        :options="multiInstanceTypeOptions"
        class="w-full"
        option-type="button"
        size="small"
        v-bind="
          ui.radioGroup.builder({
            vModel: vModeler('multiInstanceType'),
          }).props
        "
      />
    </edit-item>
    <edit-item v-show="showConditionRef" :label-width="100" label="审批集合">
      <fs-table-select
        :dict="loadDict"
        v-bind="assigneeListModeler('assigneeList')"
        :create-crud-options="userCrudOptions"
        :cross-page="true"
        :crud-options-override="{
          toolbar: { show: false },
          actionbar: { buttons: { add: { show: false } } },
          rowHandle: { show: false },
        }"
        :model-value="assigneeList"
        :multiple="true"
        :values-format="{
          labelFormatter: (item: any) => {
            return `${item.label}`;
          },
        }"
        @update:model-value="(value) => (assigneeList = value)"
      />
    </edit-item>
    <edit-item v-show="showConditionRef" :label-width="100" label="完成条件">
      <component
        :is="ui.radioGroup.name"
        :options="completionConditionOptions"
        class="w-full"
        option-type="button"
        size="small"
        v-bind="
          ui.radioGroup.builder({
            vModel: vModeler('completionCondition'),
          }).props
        "
      />
      <a-row v-show="showComparisonRef" :gutter="0">
        <a-col :span="14">
          <component
            :is="ui.select.name"
            :options="comparisonOptions"
            class="w-full"
            placeholder="请选择条件"
            size="small"
            v-bind="
              ui.radioGroup.builder({
                vModel: vModeler('comparison'),
              }).props
            "
          />
        </a-col>
        <a-col :span="10">
          <component
            :is="ui.number.name"
            class="w-full"
            max="100"
            min="1"
            placeholder="请填写表达式值"
            size="small"
            v-bind="
              ui.radioGroup.builder({
                vModel: vModeler('comparisonVal'),
              }).props
            "
          />
        </a-col>
      </a-row>
      <component
        :is="ui.input.name"
        v-show="showExpressionRef"
        class="w-full"
        max="100"
        min="1"
        placeholder="请输入完整的表达式"
        size="small"
        v-bind="
          ui.radioGroup.builder({
            vModel: vModeler('comparisonVal'),
          }).props
        "
      />
    </edit-item>
  </component>
</template>
