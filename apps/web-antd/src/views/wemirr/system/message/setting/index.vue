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
            <component :is="item.component"/>
          </TabPane>
        </template>
      </Tabs>
    </Card>
  </Page>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Card, Col, Row, Tabs} from "ant-design-vue";
import {Page} from "@vben/common-ui";
import BaseSetting from "./base-setting.vue";
import EmailSetting from "./email-setting.vue";
import {settingList} from "#/views/wemirr/system/message/setting/schema";

export default defineComponent({
  components: {
    Card,
    Tabs,
    Page,
    TabPane: Tabs.TabPane,
    BaseSetting,EmailSetting,
    ARow: Row,
    ACol: Col,
  },
  setup() {
    return {
      prefixCls: "account-setting",
      settingList,
      tabBarStyle: {
        width: "220px",
      },
    };
  },
});
</script>