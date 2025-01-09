<script setup>
import { Page } from '@vben/common-ui';

import PrintDesigner from '#/views/wemirr/develop/print/PrintDesigner/index.vue';
</script>

<template>
  <Page title="实验功能-在线打印">
    <template #description>
      孵化阶段,暂不支持复杂的逻辑交,复杂打印建议使用
      <a-button type="link">
        <a href="https://gitee.com/jeecg/JimuReport" target="_blank">
          积木报表
        </a>
      </a-button>
    </template>
    <PrintDesigner />
  </Page>
</template>
