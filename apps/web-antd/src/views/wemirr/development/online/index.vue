<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { EDesigner } from 'epic-designer';
</script>
<template>
  <Page content-class="flex flex-row gap-2 designer-container">
    <EDesigner
      :disabled-zoom="true"
      :hidden-header="true"
      :lock-default-schema-edit="true"
    />
  </Page>
</template>

<style scoped lang="less"></style>
