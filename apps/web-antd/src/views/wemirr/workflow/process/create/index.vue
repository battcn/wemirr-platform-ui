<script lang="ts" setup>
import type { PageSchema } from 'epic-designer';

import { onMounted, reactive, ref, watch } from 'vue';

import { FsIcon, useUi } from '@fast-crud/fast-crud';
import { Card, notification } from 'ant-design-vue';
import { EBuilder } from 'epic-designer';

import * as api from './api';

const prefixCls = 'list-card';
const state = reactive({
  generateFormRenderKey: '',
  previewOpen: false,
  title: null,
  modelId: '',
  generateFormRef: null,
  pageSchema: ref<PageSchema>({
    schemas: [],
    script: '',
  }),
});
const { ui } = useUi();
watch(
  () => state.previewOpen,
  () => {
    if (state.previewOpen) {
      state.generateFormRenderKey = Date.now().toString();
    }
  },
  {
    deep: true,
  },
);

const initProcessForm = (item: any) => {
  api.GetFormConfigByModelId(item.id).then((ret) => {
    if (!ret) {
      notification.error({ message: '未配置表单', duration: 2 });
      return;
    }
    state.title = item.diagramName;
    state.previewOpen = true;
    state.modelId = item.id;
    state.pageSchema = { schemas: ret.schemas, script: ret.script };
  });
};
const ebRef = ref<any>(null);

async function handleReset() {
  // 获取表单实例
  const form = await ebRef.value?.getFormInstance();
  // 调用组件实例方法，参考ui from 提供的重置方法，本案例以Ant Design Vue为基础UI
  form?.resetFields();
}
const submitProcessInstance = () => {
  ebRef.value.validate().then((data: any) => {
    api
      .startProcessInstance(state.modelId, {
        formData: data,
        businessKey: Date.now(),
        businessGroup: 'DEFAULT',
        instanceName: state.title,
      })
      .then(() => {
        ui.notification.success('流程发布成功');
        state.previewOpen = false;
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
                    <FsIcon class="icon" icon="ic:outline-pending" />
                    <span class="text-md mt-2 truncate">待处理</span>
                  </span>
                </a>
              </a-col>
              <a-col :span="6">
                <a>
                  <span class="flex flex-col items-center">
                    <FsIcon class="icon" icon="mdi:success-circle-outline" />
                    <span class="text-md mt-2 truncate">已处理</span>
                  </span>
                </a>
              </a-col>
              <a-col :span="6">
                <a>
                  <span class="flex flex-col items-center">
                    <FsIcon class="icon" icon="bi:send" />
                    <span class="text-md mt-2 truncate">已发起</span>
                  </span>
                </a>
              </a-col>
              <a-col :span="6">
                <a>
                  <span class="flex flex-col items-center">
                    <FsIcon class="icon" icon="mdi:email-receive-outline" />
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
                        <FsIcon
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
      v-model:open="state.previewOpen"
      :destroy-on-close="true"
      :title="state.title"
      width="800px"
      wrap-class-name="preview-modal-style"
    >
      <EBuilder ref="ebRef" :page-schema="state.pageSchema" />

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

/deep/.icon {
  margin-right: 10px;
  font-size: 34px !important;
  color: #006be6;
}

.list-card {
  .ant-list-item {
    padding: 0;
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
      font-size: 18px;
      font-weight: 500;
    }

    &-detail {
      padding-top: 10px;
      padding-left: 30px;
      font-size: 14px;
    }
  }
}
</style>
