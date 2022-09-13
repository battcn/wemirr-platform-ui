<template>
  <Footer :class="prefixCls" ref="footerRef" v-if="getShowLayoutFooter || forceShow">
    <div :class="`${prefixCls}__links`">
      <a @click="openWindow(SITE_URL)">{{ t('layout.footer.contactMe') }}</a>
      <a-divider type="vertical" />
      <a @click="openWindow(DOC_URL)">{{ t('layout.footer.onlineDocument') }}</a>
      <a-divider type="vertical" />
      <a @click="openWindow(DOC_URL)">{{ t('layout.footer.question') }}</a>
      <a-divider type="vertical" />
      <a @click="openWindow(GITHUB_URL)">GitHub</a>
    </div>
    <div :class="`${prefixCls}__links`">
      <a class="beian" @click="openWindow(BEIAN_URL)">湘ICP备15017829号-1 </a>
      Copyright &copy;2020 wemirr&nbsp;&nbsp;版权所有
    </div>
  </Footer>
</template>

<script lang="ts" setup>
  import { computed, unref, ref } from 'vue';
  import { Layout } from 'ant-design-vue';
  import { DOC_URL, SITE_URL, GITHUB_URL } from '/@/settings/siteSetting';
  import { openWindow } from '/@/utils';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useRouter } from 'vue-router';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLayoutHeight } from '../content/useContentViewHeight';
  import { propTypes } from '/@/utils/propTypes';
  defineProps({
    forceShow: propTypes.bool.def(false),
  });
  const Footer = Layout.Footer;
  const { t } = useI18n();
  const { getShowFooter } = useRootSetting();
  const { currentRoute } = useRouter();
  const { prefixCls } = useDesign('layout-footer');
  const BEIAN_URL = ref<string>('https://beian.miit.gov.cn');
  const footerRef = ref<ComponentRef>(null);
  const { setFooterHeight } = useLayoutHeight();

  const getShowLayoutFooter = computed(() => {
    if (unref(getShowFooter)) {
      const footerEl = unref(footerRef)?.$el;
      setFooterHeight(footerEl?.offsetHeight || 0);
    } else {
      setFooterHeight(0);
    }
    return unref(getShowFooter) && !unref(currentRoute).meta?.hiddenFooter;
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-footer';

  @normal-light-color: #313131;
  @hover-light-color: #007aff;
  @normal-dark-color: #a3a3af;
  @hover-dark-color: #007aff;

  .@{prefix-cls} {
    font-weight: 400;
    color: @normal-light-color;
    text-align: center;
    padding: 5px 50px;

    &__links {
      margin-bottom: 8px;

      a {
        color: @normal-light-color;

        &:hover {
          color: @hover-light-color;
          border-bottom: 2px solid @hover-light-color;
        }
      }

      .ant-divider {
        background-color: #7b7474;
      }

      .beian {
        margin-right: 10px;
      }
    }

    &__github {
      margin: 0 30px;

      &:hover {
        color: @hover-light-color;
      }
    }
  }

  [data-theme='dark'] .@{prefix-cls} {
    color: @normal-dark-color !important;
    text-align: center;
    padding: 5px 50px;

    &__links {
      margin-bottom: 8px;

      a {
        color: @normal-dark-color !important;

        &:hover {
          color: @hover-dark-color !important;
        }
      }

      .ant-divider {
        background-color: #7b7474 !important;
      }
    }

    &__github {
      margin: 0 30px;

      &:hover {
        color: @hover-dark-color !important;
      }
    }
  }
</style>
