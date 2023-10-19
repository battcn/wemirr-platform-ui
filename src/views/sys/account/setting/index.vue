<template>
  <PageWrapper>
    <a-row :gutter="16">
      <a-col :md="24" :lg="7">
        <!-- 基本信息 -->
        <BaseInfo />
      </a-col>
      <a-col :md="24" :lg="17">
        <!-- 基本设置 -->
        <!--        <ScrollContainer>-->
        <Card :bordered="false" class="account-setting-card">
          <div ref="wrapperRef" :class="prefixCls">
            <Tabs tab-position="left" :tabBarStyle="tabBarStyle">
              <template v-for="item in settingList" :key="item.key">
                <TabPane :tab="item.name">
                  <component :is="item.component" />
                </TabPane>
              </template>
            </Tabs>
          </div>
        </Card>
        <!--        </ScrollContainer>-->
      </a-col>
    </a-row>
  </PageWrapper>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Card, Col, Row, Tabs } from "ant-design-vue";

import { ScrollContainer } from "@/components/Container";
import { settingList } from "./data";
import { PageWrapper } from "@/components/Page";
import BaseInfo from "./BaseInfo.vue";
import BaseSetting from "./BaseSetting.vue";
import SecureSetting from "./SecureSetting.vue";
import AccountBind from "./AccountBind.vue";
import MsgNotify from "./MsgNotify.vue";

export default defineComponent({
  components: {
    Card,
    PageWrapper,
    ScrollContainer,
    Tabs,
    TabPane: Tabs.TabPane,
    BaseInfo,
    BaseSetting,
    SecureSetting,
    AccountBind,
    MsgNotify,
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
<style lang="less">
.account-setting-card {
  .ant-card-body {
    padding: 0 !important;
  }
}
.account-setting {
  margin: 5px;
  background-color: @component-background;

  .base-title {
    padding-left: 0;
  }
  .ant-tabs-nav-wrap {
    min-height: 700px;
  }
  .ant-tabs-tab-active {
    background-color: @item-active-bg;
  }
}
</style>
