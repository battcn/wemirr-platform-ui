<script lang="ts" setup name="ElementUserAssign">
import { computed, getCurrentInstance, nextTick, ref } from 'vue';
import type { Ref } from 'vue';

import { useModelerStore } from '@fast-crud/fast-bpmn';
import { dict } from '@fast-crud/fast-crud';
import { useUi } from '@fast-crud/ui-interface';

// import userCrudOptions from "./user";
import userCrudOptions from '#/views/wemirr/system/user/crud';
// import { isArray } from "@/utils/is";
import { UserOutlined } from '@ant-design/icons-vue';
import { isArray } from 'ant-design-vue/es/_util/util';

import { getUserList } from '#/api/core/user';

const { ui } = useUi();

const { injectModelerStore } = useModelerStore();
const modelerStore = injectModelerStore();
const { ctx: that } = getCurrentInstance() as any;
const element = computed(() => modelerStore!.getActive!);
const helper = modelerStore.helper;
const formData: Ref = ref();
const assignee: Ref = ref([]);
async function reload() {
  let assigneeList: any = helper.getElementProperty(
    element.value,
    'assignee',
    true,
  );
  if (assigneeList) {
    assigneeList = isArray(assigneeList)
      ? assigneeList
      : assigneeList.split(',');
  }
  assignee.value = assigneeList;
  await nextTick();
  that.$forceUpdate();
}

modelerStore.onElementUpdate(reload);

function vModeler(key: string) {
  const valueKey = key ? `value.${key}` : 'value';
  return {
    ref: formData,
    key: valueKey,
    onChange: (value: any) => {
      helper.setElementProperty(element.value, key, value, true);
    },
  };
}
const loadDict = ref(
  dict({
    immediate: true,
    getNodesByValues: async (values: any[]) => {
      return await getUserList(values);
    },
  }),
);

const valuesFormat = {
  labelFormatter: (item: any) => {
    return `${item.label}`;
  },
};
</script>

<template>
  <component :is="ui.collapseItem.name" name="element-documentations">
    <template #header>
      <collapse-title :title="$t('panel.userAssign')">
        <UserOutlined />
      </collapse-title>
    </template>
    <edit-item :label-width="80" label="审批人员">
      <fs-table-select
        :dict="loadDict"
        v-bind="vModeler('assignee')"
        :create-crud-options="userCrudOptions"
        :cross-page="true"
        :crud-options-override="{
          toolbar: { show: false },
          actionbar: { buttons: { add: { show: false } } },
          rowHandle: { show: false },
        }"
        :model-value="assignee"
        :multiple="false"
        :values-format="valuesFormat"
        @update:model-value="(value) => (assignee = value)"
      />
    </edit-item>
  </component>
</template>
