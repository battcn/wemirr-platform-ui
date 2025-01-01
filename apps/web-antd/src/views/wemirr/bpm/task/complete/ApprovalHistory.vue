<script lang="ts" setup>
import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { CheckCircleTwoTone } from '@ant-design/icons-vue';
import { Step, Steps } from 'ant-design-vue';
import dayjs from 'dayjs';

import * as api from './api';

const router = useRouter();
const procInstId = router.currentRoute.value.query.procInstId;
const stepNodes = ref([]) as any;
onMounted(() => {
  api.getProcessInstanceComments(procInstId).then((ret) => {
    stepNodes.value = ret || [];
  });
});
</script>
<template>
  <div class="result-success m-5">
    <div class="result-success__content">
      <Steps
        :current="stepNodes.length + 2"
        :responsive="true"
        size="small"
        status="error"
        type="navigation"
      >
        <template v-for="item in stepNodes" :key="item.id">
          <Step
            :icon="item?.taskStatus !== 'cancel' ? h(CheckCircleTwoTone) : null"
            :status="
              item?.taskStatus === 'cancel'
                ? 'error'
                : item.procInstaStatus === 'done'
                  ? 'finish'
                  : 'process'
            "
            :title="item?.approverName"
          >
            <template #description>
              <div>{{ item?.taskName }}</div>
              <div>{{ item?.remark }}</div>
              <div>
                {{ dayjs(item?.approverTime).format('YYYY-MM-DD HH:mm') }}
              </div>
            </template>
          </Step>
        </template>
      </Steps>
    </div>
  </div>
</template>
<style lang="less" scoped>
.result-success {
  padding: 48px 32px;
  //background-color: @component-background;

  &__content {
    padding: 24px 40px;
    //background-color: @background-color-light;
  }
}
</style>
