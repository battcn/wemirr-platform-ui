<script lang="ts" setup>
import { computed, getCurrentInstance, nextTick, reactive } from 'vue';

import { MessageOutlined } from '@ant-design/icons-vue';
import { useModelerStore } from '@fast-crud/fast-bpmn';
import { useUi } from '@fast-crud/ui-interface';
import { isArray } from 'ant-design-vue/es/_util/util';

// import { isArray } from "@/utils/is";
import {
  NOTIFY_OPTIONS,
  TASK_NOTIFY_CONTENT,
  TASK_NOTIFY_LISTENERS,
} from './data';

const formRef = reactive({
  receiverUserAssign: [],
  notifyTypes: [],
  notifyContent: TASK_NOTIFY_CONTENT.stringValue,
  notifyListeners: TASK_NOTIFY_LISTENERS,
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
  await nextTick();
  that.$forceUpdate();
}
modelerStore.onElementUpdate(reload);
function addNotifyTypeAttr() {
  const notifyTypes = formData.notifyTypes;
  helper.setElementProperty(element.value, 'notifyTypes', notifyTypes, true);
  helper.removeAllTaskListener(element.value);
  for (const notifyType of notifyTypes) {
    const listener = formRef.notifyListeners[notifyType];
    helper.addTaskListener(element.value, listener, false);
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
</script>

<template>
  <component :is="ui.collapseItem.name" name="element-documentations">
    <template #header>
      <collapse-title title="审批通知">
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
      <a-tag color="#f50">审批人</a-tag>
      <a-tag color="#2db7f5">通知时间</a-tag>
      <a-tag color="#87d068">任务名称</a-tag>
    </edit-item>
  </component>
</template>
