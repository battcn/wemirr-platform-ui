<script lang="ts" setup>
import type { FsBpmnPanelProps } from '@fast-crud/fast-bpmn';

import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import * as api from './api';
import ElementEndEventNotify from './ElementEndEventNotify.vue';
import ElementMultiInstance from './ElementMultiInstance.vue';
import ElementProcessCategory from './ElementProcessCategory.vue';
import ElementUserAssign from './ElementUserAssign.vue';
import ElementUserTaskNotify from './ElementUserTaskNotify.vue';

const router = useRouter();
const route = useRoute();
const xmlRef = ref();
const title = ref('模型设计');
const modelId = ref(route.query?.modelId as string);
const isCopy = ref(route.query?.isCopy as string);
const history = ref(route.query?.history as string);

function goBack() {
  router.push('/bpm/process/model');
}

const binding: Ref = ref({
  showToolbar: true,
  showMinimap: true,
  showPanel: true,
  showSettings: false,
  showPalette: true,
  showContextMenu: true,
  showNameAndCode: true,
  showExtensionProperties: true,
});
const panelProps = ref<FsBpmnPanelProps>({
  defaultExpand: [
    'ElementGenerations',
    'ElementUserAssign',
    'ElementProcessCategory',
    'ElementUserTaskNotify',
    'ElementEndEventNotify',
  ],
  // 注册自定义组件
  registerComponents() {
    // 也可以写在 bpmn-setup进行全局注册
    return {
      ElementProcessCategory: {
        order: 2,
        component: ElementProcessCategory,
        props: {},
        show(element: any) {
          return element.type === 'bpmn:Process';
        },
      },
      ElementUserAssign: {
        order: 3,
        component: ElementUserAssign,
        props: {},
        show(element: any) {
          return element.type === 'bpmn:UserTask';
        },
      },
      ElementMultiInstance: {
        order: 4,
        component: ElementMultiInstance,
        props: {},
        show(element: any) {
          // 什么情况下显示此组件， element为当前选中的元素节点
          return element.type === 'bpmn:UserTask';
        },
      },
      ElementUserTaskNotify: {
        order: 4,
        component: ElementUserTaskNotify,
        props: {},
        show(element: any) {
          return element.type === 'bpmn:UserTask';
        },
      },
      ElementEndEventNotify: {
        order: 5,
        component: ElementEndEventNotify,
        props: {},
        show(element: any) {
          return element.type === 'bpmn:EndEvent';
        },
      },
    };
  },
  // 重新设置组件配置
  resetComponents(elements: any, components: any) {
    // console.log("elements", elements);
    // components.ElementExtensionAttribute.show = false
    // 是否显示生成
    components.ElementGenerations.show = true;
    // 是否显示[执行作业]
    components.ElementJobExecution.show = false;
    // 是否显示[扩展属性]
    components.ElementExtensionProperties.show = false;
    // 是否显示[执行监听器配置]
    components.ElementExecutionListeners.show = false;
    // 是否显示[异步控制]
    components.ElementAsyncContinuations.show = false;
    // 是否显示[启动器控制]
    components.ElementStartInitiator.show = false;
    // components.ElementUserAssign.show = true
    // 是否显示[文档元素]
    components.ElementDocumentations.show = false;
    components.ElementGenerations.props.showNameAndCode =
      binding.value.showNameAndCode;
    if (!binding.value.showExtensionProperties) {
      components.ElementExtensionProperties.show = false;
    }
  },
});

async function onSave(bpm: any) {
  const processInfo = {
    diagramData: bpm.xml,
    diagramName: bpm.rootElement.name,
    definitionKey: bpm.rootElement.id,
    categoryId: bpm.rootElement.$attrs['camunda:categoryType'],
    diagramIcon: bpm.rootElement.$attrs['camunda:diagramIcon'],
    havePool: 0,
  };
  try {
    await (modelId.value && !isCopy.value
      ? api.ModifyProcessModel({ id: modelId.value, ...processInfo })
      : api.AddProcessModel(processInfo));
    goBack();
  } catch (error: any) {
    console.error('bpm save error', error);
  }
}

async function handleDetail() {
  if (modelId.value) {
    let data;
    if (history.value) {
      // data = await getHistoryById(modelId.value);
    } else {
      data = await api.GetById(modelId.value);
    }
    title.value = `编辑模型${data.diagramName ? `(${data.diagramName})` : ''}`;
    xmlRef.value = data.diagramData;
  } else {
    title.value = '新增模型';
  }
}

onMounted(() => {
  handleDetail();
});
</script>
<template>
  <Page :title="title" content-class="flex flex-row gap-2">
    <fs-bpmn
      v-model:xml="xmlRef"
      :panel="panelProps"
      v-bind="binding"
      class="v-fs-bpmn"
      @save="onSave"
    />
  </Page>
</template>
<style lang="less" scoped>
/deep/ .p-4.p-4 {
  padding: 8px !important;
}

.v-fs-bpmn {
  background-color: #fff;

  .fs-table-select {
    .ant-select-show-search {
      width: 100%;
    }
  }
}

.vben-page-wrapper {
  display: flex;
}
</style>
