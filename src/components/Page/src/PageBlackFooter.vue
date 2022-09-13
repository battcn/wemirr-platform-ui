<template>
  <div :class="prefixCls" class="w-full h-full">
    <slot></slot>
    <div
      :class="backgroundTransparent ? `${prefixCls}__transparent_bottom` : `${prefixCls}__bottom`"
    >
      <LayoutFooter :forceShow="forceShow" />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { propTypes } from '/@/utils/propTypes';
  export default defineComponent({
    name: 'PageBlackFooter',
    components: {
      LayoutFooter: createAsyncComponent(() => import('/@/layouts/default/footer/index.vue')),
    },
    inheritAttrs: false,
    props: {
      backgroundTransparent: {
        type: Boolean,
        default: true,
      },
      forceShow: propTypes.bool.def(false),
    },
    setup() {
      const { prefixCls } = useDesign('page-black-footer');
      const { getCalcContentWidth } = useMenuSetting();
      return { prefixCls, getCalcContentWidth };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-page-black-footer';

  @foot-prefix-cls: ~'@{namespace}-layout-footer';

  .@{prefix-cls} {
    width: 100%;

    &__bottom {
      position: absolute;
      z-index: @page-footer-z-index;
      width: 100%;
      bottom: 0;
    }

    &__transparent_bottom {
      position: absolute;
      z-index: @page-footer-z-index;
      width: 100%;
      bottom: 0;

      .@{foot-prefix-cls} {
        background-color: transparent !important;
      }
    }
  }
</style>
