<template>
  <div :style="getPlaceholderDomStyle" v-if="getIsShowPlaceholderDom"></div>
  <div :style="getWrapStyle" :class="getClass">
    <LayoutHeader v-if="getShowInsetHeaderRef" />
    <MultipleTabs v-if="getShowTabs" />
    <SlideXTransition>
      <a-alert
        type="info"
        class="banner-notice"
        banner
        closable
        v-if="getShowBannerNotice"
        @close="handleClose"
      >
        <template #icon><AlertOutlined />({{ bannerNoticeList.length }})</template>
        <template #message>
          <div
            ref="contentParentDomRef"
            class="content-banner-notice-parent"
            @mouseenter="handleAnimate(0)"
            @mouseleave="handleAnimate(1)"
          >
            <div ref="contentDomRef" class="content-banner-notice">
              {{ noticeInfo['data'] }}
            </div>
          </div>
        </template>
      </a-alert>
    </SlideXTransition>
  </div>
</template>
<script lang="ts" setup>
  import { unref, computed, CSSProperties, onMounted, ref, nextTick } from 'vue';
  import { SlideXTransition } from '/@/components/Transition';
  import LayoutHeader from './index.vue';
  import { AlertOutlined } from '@ant-design/icons-vue';
  import MultipleTabs from '../tabs/index.vue';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useFullContent } from '/@/hooks/web/useFullContent';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLayoutHeight } from '../content/useContentViewHeight';
  import { connectWebSocket, onWebSocket, SocketMessageEvent } from '/@/hooks/web/useWebSocket';
  const HEADER_HEIGHT = 48;
  const TABS_HEIGHT = 32;
  const BANNER_NOTICE_HEIGHT = 32;
  const contentDomRef = ref();
  const contentParentDomRef = ref();
  const noticeInfo = ref('');
  const animate = ref();
  const isAnimating = ref(false);
  const { setHeaderHeight } = useLayoutHeight();
  const { prefixCls } = useDesign('layout-multiple-header');
  const { getCalcContentWidth, getSplit } = useMenuSetting();
  const { getIsMobile } = useAppInject();
  const {
    getFixed,
    getShowInsetHeaderRef,
    getShowFullHeaderRef,
    getHeaderTheme,
    getShowHeader,
    getShowNotice,
  } = useHeaderSetting();
  const bannerNoticeList = ref<string[]>([]);
  const { getFullContent } = useFullContent();

  const { getShowMultipleTab } = useMultipleTabSetting();

  const getShowTabs = computed(() => {
    return unref(getShowMultipleTab) && !unref(getFullContent);
  });

  const getShowBannerNotice = computed(() => {
    return unref(getShowNotice) && !unref(getFullContent) && unref(bannerNoticeList).length > 0;
  });

  const getIsShowPlaceholderDom = computed(() => {
    return unref(getFixed) || unref(getShowFullHeaderRef);
  });

  const getWrapStyle = computed((): CSSProperties => {
    const style: CSSProperties = {};
    if (unref(getFixed)) {
      style.width = unref(getIsMobile) ? '100%' : unref(getCalcContentWidth);
    }
    if (unref(getShowFullHeaderRef)) {
      style.top = `${HEADER_HEIGHT}px`;
    }
    return style;
  });

  const getIsFixed = computed(() => {
    return unref(getFixed) || unref(getShowFullHeaderRef);
  });

  const getPlaceholderDomStyle = computed((): CSSProperties => {
    let height = 0;
    if (
      (unref(getShowFullHeaderRef) || !unref(getSplit)) &&
      unref(getShowHeader) &&
      !unref(getFullContent)
    ) {
      height += HEADER_HEIGHT;
    }
    if (unref(getShowMultipleTab) && !unref(getFullContent)) {
      height += TABS_HEIGHT;
    }
    if (unref(getShowBannerNotice) && !unref(getFullContent)) {
      height += BANNER_NOTICE_HEIGHT;
    }
    setHeaderHeight(height);
    return {
      height: `${height}px`,
    };
  });
  onMounted(() => {
    nextTick(() => {
      connectWebSocket();
    });
    onWebSocket(handleBannerNotice, SocketMessageEvent.NOTICE_EVENT);
  });
  function handleBannerNotice(data: any) {
    if (data.type == 1 && data.showType == 1) {
      bannerNoticeList.value.push(data);
      if (!isAnimating.value) {
        isAnimating.value = true;
        setTimeout(startAnimate, 2000);
      }
    }
  }
  async function startAnimate() {
    while (bannerNoticeList.value && bannerNoticeList.value.length > 0) {
      noticeInfo.value = bannerNoticeList.value[0] as string;
      const ballEl = contentParentDomRef.value;
      if (ballEl) {
        const offsetWidth = ballEl.offsetWidth;
        animate.value = contentDomRef.value.animate(
          {
            transform: [`translateX(${offsetWidth}px)`, `translateX(0px)`],
          },
          {
            duration: 3000,
            fill: 'forwards',
            easing: 'ease-out',
          },
        );
        await animate.value.finished;
        // 暂停部分
        const contentEl = contentDomRef.value;
        const itemWidth = contentEl.getBoundingClientRect().width;
        const gapWidth = Math.max(0, itemWidth - offsetWidth + 50);
        const duration = Math.max(0, Math.floor(gapWidth / 200) * 1000);
        animate.value = contentEl.animate(
          {
            transform: [`translateX(0px)`, `translateX(-${gapWidth}px)`],
          },
          {
            duration,
            delay: 3000,
            fill: 'forwards',
            easing: 'linear',
          },
        );
        await animate.value.finished;
        // 滑出部分
        animate.value = contentEl.animate(
          {
            transform: [`translateX(-${gapWidth}px)`, `translateX(-${itemWidth}px)`],
          },
          {
            duration: 1000,
            fill: 'forwards',
            easing: 'ease-in',
          },
        );
        await animate.value.finished;
      }
      bannerNoticeList.value.splice(0, 1);
    }
    isAnimating.value = false;
  }
  function handleAnimate(type: number) {
    if (animate.value?.playState !== 'finished') {
      if (type == 0) {
        animate.value?.pause();
      } else {
        animate.value?.play();
      }
    }
  }
  function handleClose() {
    bannerNoticeList.value = [];
  }
  const getClass = computed(() => {
    return [
      prefixCls,
      `${prefixCls}--${unref(getHeaderTheme)}`,
      { [`${prefixCls}--fixed`]: unref(getIsFixed) },
    ];
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-layout-multiple-header';

  .@{prefix-cls} {
    transition: width 0.2s;
    flex: 0 0 auto;

    &--dark {
      margin-left: -1px;
    }

    &--fixed {
      position: fixed;
      top: 0;
      z-index: @multiple-tab-fixed-z-index;
      width: 100%;
    }

    .banner-notice {
      height: 32px;
      padding: 0px 10px;
      line-height: 32px;
    }

    .content-banner-notice-parent {
      margin: 0px 5px;
      white-space: nowrap;
      text-align: center;
      position: relative;
      height: 32px;
      line-height: 32px;
      align-items: center;
      overflow: hidden;

      .content-banner-notice {
        position: absolute;
        height: 100%;
        white-space: nowrap;
        transition-timing-function: linear;
      }
    }
  }
</style>
