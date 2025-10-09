<script setup lang="ts">
import type { Flow } from '#/api/workflow/instance/model';

import { computed, h, onMounted, ref } from 'vue';

import { VbenAvatar } from '@vben/common-ui';
import { cn } from '@vben/utils';

import {
  MessageOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { Avatar, TimelineItem } from 'ant-design-vue';

import { LocalDictCode } from '#/api';
import { ossInfo } from '#/api/system/oss';
import { renderLocalDict } from '#/utils/render';
import { formatTime } from '#/utils/util.time';

defineOptions({
  name: 'ApprovalTimelineItem',
});

const props = defineProps<{ item: Flow }>();

interface AttachmentInfo {
  ossId: string;
  url: string;
  name: string;
}

/**
 * 处理附件信息
 */
const attachmentInfo = ref<AttachmentInfo[]>([]);
onMounted(async () => {
  if (!props.item.ext) {
    return null;
  }
  const resp = await ossInfo(props.item.ext.split(','));
  attachmentInfo.value = resp.map((item) => ({
    ossId: item.ossId,
    url: item.url,
    name: item.originalName,
  }));
});

/**
 * 这里无法处理昵称中带,的情况
 */
const isMultiplePerson = computed(
  () => props.item.approverName?.split(',').length > 1,
);
</script>

<template>
  <TimelineItem>
    <template #dot>
      <div class="relative rounded-full border">
        <Avatar
          class="bg-primary-400"
          v-if="isMultiplePerson"
          :size="36"
          :icon="h(UsergroupAddOutlined)"
        />
        <VbenAvatar
          v-else
          :alt="item?.approverName ?? 'unknown'"
          class="bg-primary size-[36px] rounded-full text-white"
          src=""
        />
        <div
          :class="
            cn(
              'absolute bottom-0 right-[-2px]',
              'size-[12px] rounded-full bg-green-500',
              'border-[2px] border-white',
            )
          "
        ></div>
      </div>
    </template>
    <div class="mb-5 ml-2 flex flex-col gap-1">
      <div class="flex items-center gap-1">
        <div class="font-bold">{{ item.nodeName }}</div>
        <component
          :is="renderLocalDict(item.flowStatus, LocalDictCode.WF_TASK_STATUS)"
        />
      </div>

      <div :class="cn('mt-2 flex flex-wrap gap-2')" v-if="isMultiplePerson">
        <div
          :class="cn('bg-foreground/5 flex items-center rounded-full', 'p-1')"
          v-for="(name, index) in item.approverName.split(',')"
          :key="index"
        >
          <Avatar
            class="bg-primary-400 flex items-center justify-center"
            :size="24"
            :icon="h(UserOutlined)"
          />
          <span class="px-1">{{ name }}</span>
        </div>
      </div>
      <div v-else>{{ item.approverName }}</div>

      <div>
        {{ formatTime(item.approvalTime) }}
      </div>
      <div
        v-if="item.message"
        class="rounded-lg border px-3 py-1"
        :class="cn('flex gap-2')"
      >
        <MessageOutlined />
        <div class="text-foreground/75 break-all">{{ item.message }}</div>
      </div>
      <div v-if="attachmentInfo.length > 0" class="flex flex-wrap gap-2">
        <!-- 这里下载的文件名不是原始文件名 -->
        <a
          v-for="attachment in attachmentInfo"
          :key="attachment.ossId"
          :href="attachment.url"
          class="text-primary"
          target="_blank"
        >
          <div class="flex items-center gap-1">
            <span class="icon-[mingcute--attachment-line] size-[18px]"></span>
            <span>{{ attachment.name }}</span>
          </div>
        </a>
      </div>
    </div>
  </TimelineItem>
</template>
