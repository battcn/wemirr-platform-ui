<script lang="ts" setup>
import { computed, getCurrentInstance, nextTick, reactive, ref } from 'vue';

import { MessageOutlined } from '@ant-design/icons-vue';
import { useModelerStore } from '@fast-crud/fast-bpmn';
import { dict } from '@fast-crud/fast-crud';
import { useUi } from '@fast-crud/ui-interface';
import { isArray } from 'ant-design-vue/es/_util/util';

import { getUserByIds } from '#/api/core/user';
// import { isArray } from "@/utils/is";
// import userCrudOptions from "./user";
import userCrudOptions from '#/views/wemirr/system/user/crud';

import { EXECUTION_NOTIFY_LISTENERS, NOTIFY_OPTIONS } from './data';

const formRef = reactive({
  receiverUserAssign: [],
  notifyTypes: [],
  notifyContent:
    '尊敬的 ${ccName}，\n' +
    '为便于您更好的关注 ${taskName} 审批情况。如有任何疑问，请随时联系。谢谢！\n' +
    '${startUserName}',
  notifyListeners: EXECUTION_NOTIFY_LISTENERS,
});

const { ui } = useUi();
const { injectModelerStore } = useModelerStore();
const modelerStore = injectModelerStore();
const { ctx: that } = getCurrentInstance() as any;
const element = computed(() => modelerStore!.getActive!);
const helper = modelerStore.helper;
const formData = reactive({
  notifyTypes: [],
  notifyContent: '',
  receiverUserAssign: [],
});
async function reload() {
  const notifyTypes = helper.getElementProperty(
    element.value,
    'notifyTypes',
    true,
  );
  formData.notifyTypes = isArray(notifyTypes)
    ? (notifyTypes as [])
    : notifyTypes?.split(',');
  const notifyContent = helper.getElementProperty(
    element.value,
    'notifyContent',
    true,
  );
  formData.notifyContent = notifyContent || formRef.notifyContent;
  const receiverUserAssign = helper.getElementProperty(
    element.value,
    'receiverUserAssign',
    true,
  );
  formData.receiverUserAssign = isArray(receiverUserAssign)
    ? (receiverUserAssign as [])
    : receiverUserAssign?.split(',');
  await nextTick();
  that.$forceUpdate();
}
modelerStore.onElementUpdate(reload);
function addNotifyTypeAttr() {
  const notifyTypes = formData.notifyTypes;
  helper.setElementProperty(element.value, 'notifyTypes', notifyTypes, true);
  helper.removeAllExecutionListener(element.value);
  for (const notifyType of notifyTypes) {
    const listener = formRef.notifyListeners[notifyType];
    helper.addExecutionListener(element.value, listener, false);
  }
}
function addNotifyContent() {
  helper.setElementProperty(
    element.value,
    'notifyContent',
    formData.notifyContent,
    true,
  );
}

const loadUserDict = ref(
  dict({
    immediate: true,
    value: 'id',
    label: 'nickName',
    getNodesByValues: async (values: any[]) => {
      return await getUserByIds(values);
    },
  }),
);

const userValuesFormat = {
  labelFormatter: (item: any) => {
    return `${item.label}`;
  },
};

function vModeler(key: string) {
  return {
    onChange: (value: any) => {
      helper.setElementProperty(element.value, key, value, true);
    },
  };
}
</script>

<template>
  <component :is="ui.collapseItem.name" name="element-documentations">
    <template #header>
      <collapse-title title="抄送通知">
        <MessageOutlined />
      </collapse-title>
    </template>
    <edit-item :label-width="80" label="通知类型">
      <a-checkbox-group
        v-model:value="formData.notifyTypes"
        :options="NOTIFY_OPTIONS"
        @change="addNotifyTypeAttr"
      />
    </edit-item>
    <edit-item :label-width="80" label="消息模板">
      <a-textarea
        v-model:value="formData.notifyContent"
        :rows="5"
        @change="addNotifyContent"
      />
    </edit-item>
    <edit-item :label-width="80" label="模板参数">
      <a-tag color="#f50">抄送名称</a-tag>
      <a-tag color="#2db7f5">任务名称</a-tag>
      <a-tag color="#87d068">发起者</a-tag>
    </edit-item>
    <edit-item :label-width="80" label="抄送人员">
      <fs-table-select
        :dict="loadUserDict"
        :values-format="userValuesFormat"
        v-bind="vModeler('receiverUserAssign')"
        :create-crud-options="userCrudOptions"
        :cross-page="true"
        :crud-options-override="{
          toolbar: { show: false },
          actionbar: { buttons: { add: { show: false } } },
          rowHandle: { show: false },
        }"
        :model-value="formData.receiverUserAssign"
        :multiple="true"
      />
    </edit-item>
  </component>
</template>
