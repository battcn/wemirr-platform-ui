<template>
  <PageWrapper contentClass="flex" class="bg-white m-4 mr-0">
    <a-card :bordered="false" class="w-1/2 xl:w-3/7">
      <div :class="`${prefixCls}-top__avatar`">
        <img width="90" :src="avatar" />
        <span>长风一梦</span>
        <div>我曾踏足山巅，也曾进入低谷，二者都让我受益良多。</div>
      </div>
      <template v-for="detail in details" :key="detail.title">
        <p style="padding: 5px 10px">
          <Icon :icon="detail.icon" :color="detail.color" />
          {{ detail.title }}
        </p>
      </template>
      <CollapseContainer title="标签" :canExpan="false">
        <template v-for="tag in tags" :key="tag">
          <Tag class="mb-2">
            {{ tag }}
          </Tag>
        </template>
      </CollapseContainer>
      <CollapseContainer :class="`${prefixCls}-top__team`" title="团队" :canExpan="false">
        <div v-for="(team, index) in teams" :key="index" :class="`${prefixCls}-top__team-item`">
          <Icon :icon="team.icon" :color="team.color" />
          <span>{{ team.title }}</span>
        </div>
      </CollapseContainer>
    </a-card>
    <a-card :bordered="false" class="w-full xl:w-full user-card">
      <Tabs>
        <template v-for="item in achieveList" :key="item.key">
          <TabPane :tab="item.name">
            <component :is="item.component" />
          </TabPane>
        </template>
      </Tabs>
    </a-card>
  </PageWrapper>
</template>

<script lang="ts">
  import { Tag, Tabs, Row, Col } from 'ant-design-vue';
  import { defineComponent, computed } from 'vue';
  import { CollapseContainer } from '/@/components/Container';
  import Icon from '/@/components/Icon/index';
  import LoginLog from './LoginLog.vue';
  import ChangePassword from './ChangePassword.vue';
  import { PageWrapper } from '/@/components/Page';
  import headerImg from '/@/assets/images/header.jpg';
  import { tags, teams, details, achieveList } from './data';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    components: {
      PageWrapper,
      CollapseContainer,
      Icon,
      Tag,
      Tabs,
      TabPane: Tabs.TabPane,
      LoginLog,
      ChangePassword,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    setup() {
      const userStore = useUserStore();
      const avatar = computed(() => userStore.getUserInfo.avatar || headerImg);
      return {
        prefixCls: 'account-center',
        avatar,
        tags,
        teams,
        details,
        achieveList,
      };
    },
  });
</script>
<style lang="less" scoped>
  .user-card {
    min-height: 800px;
    margin-left: 20px;
    margin-right: 20px;
    .ant-card-body {
      margin-top: -12px;
    }
  }
  .account-center {
    &-col:not(:last-child) {
      padding: 0 10px;

      &:not(:last-child) {
        border-right: 1px dashed rgb(206, 206, 206, 0.5);
      }
    }

    &-top {
      padding: 10px;
      margin: 16px 16px 12px 16px;
      background-color: @component-background;
      border-radius: 3px;

      &__avatar {
        text-align: center;
        padding-bottom: 20px;

        img {
          margin: auto;
          border-radius: 50%;
        }

        span {
          display: block;
          font-size: 20px;
          font-weight: 500;
        }

        div {
          margin-top: 3px;
          font-size: 12px;
        }
      }

      &__detail {
        padding-left: 20px;
        margin-top: 15px;
      }

      &__team {
        &-item {
          display: inline-block;
          padding: 4px 24px;
        }

        span {
          margin-left: 3px;
        }
      }
    }

    &-bottom {
      padding: 10px;
      margin: 0 16px 16px 16px;
      background-color: @component-background;
      border-radius: 3px;
    }
  }
</style>
