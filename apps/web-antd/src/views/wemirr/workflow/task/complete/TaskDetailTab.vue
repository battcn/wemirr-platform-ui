<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

// import AntdGenerateForm from '#/components/FormDesigner/antd/render/AntdGenerateForm.vue';
import * as api from './api';

export default defineComponent({
  components: {
    // AntdGenerateForm,
  },
  setup() {
    const state = reactive({ widgetForm: { config: {}, list: [] } });
    const router = useRouter();
    const procInstId = router.currentRoute.value.query.procInstId;
    const stepNodes = ref([]);
    const setJsonIntoFrom = (list, dataJson) => {
      if (!list) {
        return;
      }
      list.forEach((item) => {
        for (const i in dataJson) {
          if (i === item.model) {
            if (item.type === 'table') {
              // item.options.remoteOptions = dataJson[key];
              item.options.remoteOptions = dataJson[i];
            } else {
              item.options.defaultValue = dataJson[i];
            }
            break;
          } else {
            if (item.isLayout === true && item.list && item.list.length > 0) {
              item.list.forEach((item2) => {
                if (item2.isLayout && item2.list && item2.list.length > 0) {
                  item2.list.forEach((item3) => {
                    if (i === item3.model) {
                      item3.options.defaultValue = dataJson[i];
                    }
                  });
                }
              });
            }
          }
        }
      });
      return list;
    };
    // 打开Form预览modal时，重新渲染modal
    const generateFormRenderKey = ref('');
    onMounted(() => {
      api.getFormPreviewByInstanceId(procInstId).then((ret) => {
        if (ret.formDesign.formConfig) {
          state.widgetForm.config = ret?.formDesign.formConfig;
          state.widgetForm.list = setJsonIntoFrom(
            ret?.formDesign.formFields,
            ret?.dataJson,
          );
        }
        generateFormRenderKey.value = Date.now().toString();
      });
    });

    return { stepNodes, ...state, generateFormRenderKey };
  },
});
</script>
<template>
  <div>asdasdas</div>
  <!--  <AntdGenerateForm
    :key="generateFormRenderKey"
    ref="generateFormRef"
    :data="widgetForm"
  />-->
</template>
<style lang="less" scoped>
.result-success {
  //background-color: @component-background;

  &__content {
  }
}
</style>
