<template>
  <div :class="prefixCls">
    <Popover title="" trigger="click" :overlayClassName="`${prefixCls}__overlay`">
      <Badge :count="count" dot :numberStyle="numberStyle">
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs>
          <template v-for="item in state.tabListData" :key="item.key">
            <TabPane>
              <template #tab>
                {{ item.name }}
                <span v-if="item.list.length !== 0">({{ item.list.length }})</span>
              </template>
              <NoticeList :list="item.list" />
            </TabPane>
          </template>
        </Tabs>
      </template>
    </Popover>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs, watchEffect, onMounted } from 'vue';
  import { Popover, Tabs, Badge } from 'ant-design-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import { TabItem, ListItem } from './data';
  import NoticeList from './NoticeList.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useWebSocket } from '@vueuse/core';
  import { formatToDateTime } from '/@/utils/dateUtil';

  export const tabListData: TabItem[] = [
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

  export default defineComponent({
    components: { Popover, BellOutlined, Tabs, TabPane: Tabs.TabPane, Badge, NoticeList },
    setup() {
      const { prefixCls } = useDesign('header-notify');
      const state = reactive({
        server: 'ws://localhost:9000/authority/message/1',
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
              type: '2',
              clickClose: true,
            });
          } catch (error) {
            console.log('error', error);
          }
        }
      });
      // const getIsOpen = computed(() => status.value === 'OPEN');
      // const getTagColor = computed(() => (getIsOpen.value ? 'success' : 'red'));

      let count = 0;
      for (let i = 0; i < tabListData.length; i++) {
        count += tabListData[i].list.length;
      }

      return {
        status,
        state,
        ...toRefs(state),
        prefixCls,
        tabListData,
        count,
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
