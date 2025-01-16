<script lang="ts" setup name="ElementProcessCategory">
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  reactive,
  ref,
} from 'vue';

import { useModelerStore } from '@fast-crud/fast-bpmn';
import { useUi } from '@fast-crud/ui-interface';

import { getActiveProcessCategory } from './api';
// import { IconPicker } from "#/components/Icon";

const { ui } = useUi();
const categoryList = ref([]);

const { injectModelerStore } = useModelerStore();
const { ctx: that } = getCurrentInstance() as any;

const modelerStore = injectModelerStore();

const element = computed(() => modelerStore!.getActive!);
const helper = modelerStore.helper;
const formData = reactive({
  categoryType: '',
  diagramIcon: '',
});

async function reload() {
  formData.categoryType = helper.getElementProperty(
    element.value,
    'categoryType',
    true,
  );
  formData.diagramIcon = helper.getElementProperty(
    element.value,
    'diagramIcon',
    true,
  );
  await nextTick();
  // that.$forceUpdate();
}

onMounted(async () => {
  categoryList.value = await getActiveProcessCategory();
});

modelerStore.onElementUpdate(reload);

function changeCategoryType(value: string) {
  helper.setElementProperty(element.value, 'categoryType', value, true);
}
function changeIcon(value: string) {
  formData.diagramIcon = value;
  helper.setElementProperty(element.value, 'diagramIcon', value, true);
}

function vModeler(key: string) {
  return {
    key,
    onChange: (value: any) => {
      helper.setElementProperty(element.value, key, value, true);
    },
  };
}
</script>

<template>
  <component :is="ui.collapseItem.name" name="element-documentations">
    <template #header>
      <collapse-title title="模型类别">
        <lucide-icon name="FileText" />
      </collapse-title>
    </template>
    <edit-item :label-width="80" label="模型类别">
      <component
        :is="ui.select.name"
        v-model:value="formData.categoryType"
        class="w-full"
        @change="changeCategoryType"
        v-bind="
          ui.select.builder({
            multiple: false,
            options: categoryList,
            valueName: 'id',
            labelName: 'name',
          }).props
        "
      />
    </edit-item>
    <edit-item :label-width="80" label="模型图标">
      <fs-icon-selector
        :model-value="formData.diagramIcon"
        @update:model-value="(value) => changeIcon(value)"
        :tabs="{
          type: 'line',
        }"
        class="w-full"
        v-bind="vModeler('diagramIcon')"
      />
      <a href="https://iconify.design/icon-sets/ion/" target="_blank">
        无满意的 ICON ? 请点我
      </a>
    </edit-item>
  </component>
</template>
