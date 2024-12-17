<script setup lang="ts">
import { Page } from '@vben/common-ui';
// import 'epic-designer/dist/style.css';

import { EDesigner } from 'epic-designer';
</script>
<template>
  <Page content-class="flex flex-row gap-2">
    <EDesigner
      :disabled-zoom="true"
      :hidden-header="true"
      :lock-default-schema-edit="true"
    />
  </Page>
</template>
