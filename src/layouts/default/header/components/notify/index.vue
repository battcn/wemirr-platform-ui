<template>
  <div :class="prefixCls">
    <Popover title="" trigger="click" :overlayClassName="`${prefixCls}__overlay`">
      <Badge :count="count" dot :numberStyle="numberStyle">
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs>
          <template v-for="item in listData" :key="item.key">
            <TabPane>
              <template #tab>
                {{ item.name }}
                <span v-if="item.list.length !== 0">({{ item.list.length }})</span>
              </template>
              <!-- 绑定title-click事件的通知列表中标题是“可点击”的-->
              <NoticeList :list="item.list" @title-click="onNoticeClick" />
            </TabPane>
          </template>
        </Tabs>
      </template>
    </Popover>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, reactive, ref, watchEffect } from 'vue';
  import { Popover, Tabs, Badge } from 'ant-design-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import { ListItem, TabItem } from './data';
  import NoticeList from './NoticeList.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useWebSocket } from '@vueuse/core';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { getUserInfo } from '/@/utils/auth';
  import * as api from './api';

  export default defineComponent({
    components: { Popover, BellOutlined, Tabs, TabPane: Tabs.TabPane, Badge, NoticeList },
    setup() {
      const { prefixCls } = useDesign('header-notify');
      const { createMessage } = useMessage();

      const tabListData: TabItem[] = [
        {
          key: '1',
          name: '通知',
          list: [],
        },
        {
          key: '2',
          name: '消息',
          list: [],
        },
        {
          key: '3',
          name: '待办',
          list: [],
        },
      ];

      const userInfo = getUserInfo();
      const state = reactive({
        server: import.meta.env.DEV
          ? `ws://localhost:9000/authority/message/${userInfo.userId}`
          : `wss://cloud.battcn.com/authority/message/${userInfo.userId}`,
        sendValue: '',
        recordList: [] as ListItem[],
        tabListData: tabListData,
      });
      const { status, data, send, close, open } = useWebSocket(state.server, {
        autoReconnect: true,
        heartbeat: false,
      });

      watchEffect(() => {
        if (data.value) {
          try {
            const res = JSON.parse(data.value);
            console.log('res', res);
            const avatar = res.level == '0' ? 'notice' : res.level == '1' ? 'dingding' : 'star';
            state.tabListData[res.level].list.unshift({
              id: res.id,
              avatar: `/@/assets/images/${avatar}.png`,
              title: res.title,
              description: res.description,
              datetime: formatToDateTime(res.createdTime),
              type: res.level,
              clickClose: true,
            });
          } catch (error) {
            console.log('error', error);
          }
        }
      });

      const listData = ref(tabListData);

      const count = computed(() => {
        let count = 0;
        for (let i = 0; i < tabListData.length; i++) {
          count += tabListData[i].list.length;
        }
        return count;
      });

      function onNoticeClick(record: ListItem) {
        api.MarkMessage(record.id).then((ret) => {
          listData.value[record.type].list.splice(
            listData.value[record.type].list.findIndex((item) => item.id === record.id),
            1
          );
        });
      }

      return {
        state,
        prefixCls,
        listData,
        count,
        onNoticeClick,
        numberStyle: {},
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-top: 2px;

    &__overlay {
      max-width: 360px;
    }

    .ant-tabs-content {
      width: 300px;
    }

    .ant-badge {
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
