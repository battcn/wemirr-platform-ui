<template>
  <div :class="prefixCls">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
  import { useDesign } from '/@/hooks/web/useDesign';
  const { prefixCls } = useDesign('blank-wrapper');
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-blank-wrapper';

  .@{prefix-cls} {
    padding: 16px;
  }
</style>
