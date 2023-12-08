<template>
  <PageWrapper>
    <template #headerContent> <WorkbenchHeader /> </template>
    <div class="lg:flex">
      <div class="lg:w-7/10 w-full !mr-4 enter-y">
        <ProjectCard :loading="loading" class="enter-y" />
        <DynamicInfo :loading="loading" class="!my-4 enter-y" />
      </div>
      <div class="lg:w-3/10 w-full enter-y">
        <QuickNav :loading="loading" class="enter-y" />
        <Schedule :loading="loading" class="!my-4 enter-y wp-schedule" />
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { PageWrapper } from "@/components/Page";
import WorkbenchHeader from "./components/WorkbenchHeader.vue";
import ProjectCard from "./components/ProjectCard.vue";
import QuickNav from "./components/QuickNav.vue";
import DynamicInfo from "./components/DynamicInfo.vue";
import Schedule from "./components/Schedule.vue";

const loading = ref(true);

setTimeout(() => {
  loading.value = false;
}, 200);
</script>

<style>
.wp-schedule {
  .add-schedule {
    cursor: pointer;
    margin: -10px 0 0 10px;
  }
  .ant-card-body {
    padding: 10px 8px 10px 8px !important;
  }
}
</style>
