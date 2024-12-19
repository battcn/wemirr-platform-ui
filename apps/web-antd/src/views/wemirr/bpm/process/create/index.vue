<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';

import * as api from './api';
// import AntdGenerateForm from "#/components/FormDesigner/antd/render/AntdGenerateForm.vue";
// import { useMessage } from "@/hooks/web/useMessage";
// import { CollapseContainer } from "#/components/Container";
// import Icon from "#/components/Icon/Icon.vue";
import { Card, notification } from 'ant-design-vue';

export default defineComponent({
  name: 'BpmProcessCreate',
  components: {
    // AntdGenerateForm,
    // CollapseContainer,
    // Icon,
    Card,
  },
  setup() {
    // const { notification } = useMessage();
    const state = reactive({
      generateFormRef: null as any,
      dataJsonTemplate: '',
      dataCodeTemplate: '',
      dataJsonVisible: false,
      generateFormRenderKey: '',
      widgetForm: {
        previewOpen: false,
        title: null,
        designModelId: null,
        config: {
          paddingLeft: null,
          paddingRight: null,
          paddingTop: null,
          paddingBottom: null,
          windowTop: null,
          windowWidth: null,
        },
        list: [],
      },
    });

    // 打开Form预览modal时，重新渲染modal
    // const generateFormRenderKey = ref("");
    watch(
      () => state.widgetForm.previewOpen,
      () => {
        if (state.widgetForm.previewOpen) {
          state.generateFormRenderKey = Date.now().toString();
        }
      },
      {
        deep: true,
      },
    );

    const initProcessForm = (item) => {
      api.GetFormConfigByModelId(item.id).then((ret) => {
        if (!ret) {
          notification.error({ message: '未配置表单', duration: 2 });
          return;
        }
        state.widgetForm.previewOpen = true;
        state.widgetForm.config = ret.formConfig;
        state.widgetForm.list = ret.formFields;
        state.widgetForm.designModelId = item.id;
        state.widgetForm.title = item.diagramName;
      });
    };

    const handleReset = () => state.generateFormRef.reset();
    const submitProcessInstance = () => {
      state.generateFormRef.getData().then((res: any) => {
        state.dataJsonTemplate = JSON.stringify(res, null, 2);
        state.dataJsonVisible = true;
        console.log('res', state, res);
        api
          .StartProcessInstance(state.widgetForm.designModelId, {
            formData: { ...res },
            designModelId: state.widgetForm.designModelId,
            businessKey: Date.now(),
            businessGroup: 'DEFAULT',
            instanceName: state.widgetForm.title,
          })
          .then(() => {
            handleReset();
            state.widgetForm.previewOpen = false;
            notification.success({ message: '创建成功', duration: 2 });
          });
      });
    };
    const groupList = ref([
      {
        categoryId: '',
        categoryName: '',
        modelList: [
          {
            id: '',
            diagramName: '',
            diagramIcon: '',
            definitionId: '',
          },
        ],
      },
    ]);
    // 自动请求并暴露内部方法
    onMounted(async () => {
      groupList.value = await api.ProcessModelGroupList();
    });

    return {
      prefixCls: 'list-card',
      groupList,
      api,
      ...toRefs(state),
      handleReset,
      initProcessForm,
      submitProcessInstance,
    };
  },
});
</script>
<template>
  <div :class="prefixCls">
    <a-list>
      <a-row>
        <a-col :span="12">
          <Card style="margin: 10px 5px 0 10px" title="审批中心">
            <a-row>
              <a-col :span="6">
                <a>
                  <span class="flex flex-col items-center">
                    <Icon class="icon" icon="ic:outline-pending" size="36" />
                    <span class="text-md mt-2 truncate">待处理</span>
                  </span>
                </a>
              </a-col>
              <a-col :span="6">
                <a>
                  <span class="flex flex-col items-center">
                    <Icon
                      class="icon"
                      icon="mdi:success-circle-outline"
                      size="36"
                    />
                    <span class="text-md mt-2 truncate">已处理</span>
                  </span>
                </a>
              </a-col>
              <a-col :span="6">
                <a>
                  <span class="flex flex-col items-center">
                    <Icon class="icon" icon="bi:send" size="36" />
                    <span class="text-md mt-2 truncate">已发起</span>
                  </span>
                </a>
              </a-col>
              <a-col :span="6">
                <a>
                  <span class="flex flex-col items-center">
                    <!--                    <Icon class="icon" icon="mdi:email-receive-outline" size="36" />-->
                    <span class="text-md mt-2 truncate">我收到的</span>
                  </span>
                </a>
              </a-col>
            </a-row>
          </Card>
        </a-col>
        <a-col :span="12">
          <Card style="margin: 10px 10px 0 5px" title="常用功能">
            <div style="height: 65px">计划放4个使用频率最高的快捷入口</div>
          </Card>
        </a-col>
      </a-row>
    </a-list>

    <template v-for="groupItem in groupList" :key="groupItem.categoryId">
      <!--    CollapseContainer  -->
      <div
        v-if="groupItem.modelList.length > 0"
        :title="groupItem.categoryName"
        class="my-4"
        style="margin-right: 10px; margin-left: 10px"
      >
        <div :class="`${prefixCls}__content`">
          <a-list>
            <a-row>
              <template v-for="item in groupItem.modelList" :key="item.id">
                <a-col :md="4" :xs="2" :xxl="6">
                  <a-list-item>
                    <a-card
                      :class="`${prefixCls}__card`"
                      :hoverable="true"
                      @click="initProcessForm(item)"
                    >
                      <div :class="`${prefixCls}__card-title`">
                        <Icon
                          v-if="item.diagramIcon"
                          :icon="item.diagramIcon"
                          class="icon"
                          color="#1890ff"
                        />
                        {{ item.diagramName }}
                      </div>
                    </a-card>
                  </a-list-item>
                </a-col>
              </template>
            </a-row>
          </a-list>
        </div>
      </div>
    </template>

    <a-modal
      v-model:open="widgetForm.previewOpen"
      :body-style="{
        paddingLeft: `${widgetForm.config.paddingLeft}px`,
        paddingRight: `${widgetForm.config.paddingRight}px`,
        paddingTop: `${widgetForm.config.paddingTop}px`,
        paddingBottom: `${widgetForm.config.paddingBottom}px`,
      }"
      :destroy-on-close="true"
      :style="{ top: `${widgetForm.config.windowTop}px` }"
      :title="widgetForm.title"
      :width="widgetForm.config.windowWidth"
      :z-index="1000"
      wrap-class-name="preview-modal-style"
    >
      <section id="printContent" ref="print">
        <!--        <AntdGenerateForm
          :key="generateFormRenderKey"
          ref="generateFormRef"
          :data="widgetForm"
          :disabled="true"
        />-->
      </section>

      <template #footer>
        <a-button @click="handleReset">重置</a-button>
        <a-button type="primary" @click="submitProcessInstance">
          提交审批
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
.ant-list-header {
  .ant-list-header {
    border-block-end: none !important;
  }
}

.list-card {
  .ant-list-item {
    padding: 10px;
  }

  &__link {
    margin-top: 10px;
    font-size: 14px;

    a {
      margin-right: 30px;
    }

    span {
      margin-left: 5px;
    }
  }

  &__card {
    width: 100%;
    margin-bottom: 20px;

    .ant-card-body {
      padding: 16px;
    }

    &-title {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      //color: @text-color;
      font-size: 18px;
      font-weight: 500;

      .icon {
        margin-right: 10px;
        font-size: 34px !important;
      }
    }

    &-detail {
      padding-top: 10px;
      padding-left: 30px;
      //color: @text-color-secondary;
      font-size: 14px;
    }
  }
}
</style>
