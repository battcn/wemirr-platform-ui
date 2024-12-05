<script lang="ts">
import { defineComponent } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Col, Row, Tabs } from 'ant-design-vue';

import { settingList } from '#/views/wemirr/system/message/setting/schema';

import BaseSetting from './base-setting.vue';
import DingTalkSetting from './ding-talk-setting.vue';
import EmailSetting from './email-setting.vue';
import SmsSetting from './sms-setting.vue';

export default defineComponent({
  components: {
    Card,
    Tabs,
    Page,
    TabPane: Tabs.TabPane,
    BaseSetting,
    EmailSetting,
    SmsSetting,
    DingTalkSetting,
    ARow: Row,
    ACol: Col,
  },
  setup() {
    return {
      prefixCls: 'account-setting',
      settingList,
      tabBarStyle: {
        width: '220px',
      },
    };
  },
});
</script>

<template>
  <Page
    content-class="flex flex-row gap-4"
    description="不同消息通道设置均不相同，所以为了更好的进行消息推送，请填写正确的配置信息"
    title="通道设置"
  >
    <Card :bordered="false" class="w-full">
      <Tabs tab-position="left">
        <template v-for="item in settingList" :key="item.key">
          <TabPane :tab="item.name">
            <component :is="item.component" />
          </TabPane>
        </template>
      </Tabs>
    </Card>
  </Page>
</template>

<style lang="less" scoped>
/deep/ .p-4 {
  padding: 8px !important;
}

/deep/ .sys-user-page-card {
  .fs-crud-container {
    min-height: 740px !important;
    max-height: 980px !important;
  }

  .ant-card-body {
    padding: 8px;
  }
}
</style>
