<script setup lang="ts">
import { nextTick, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { message } from 'ant-design-vue';

interface ChatMessage {
  content: string;
  type: 'ai' | 'user';
  sender: string;
  timestamp: number;
}

const chatRef = ref<HTMLElement | null>(null);
const inputMessage = ref('');
const messages = ref<ChatMessage[]>([]);
const loading = ref(false);

// 模拟AI回复
const simulateAiResponse = (userMessage: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userMessage);
    }, 200);
  });
};

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (chatRef.value) {
    chatRef.value.scrollTop = chatRef.value.scrollHeight;
  }
};

// 发送消息
const sendMessage = async () => {
  const userContent = inputMessage.value.trim();
  if (!userContent) {
    message.warning('请输入消息内容');
    return;
  }

  // 添加用户消息
  messages.value.push({
    content: userContent,
    type: 'user',
    sender: '我',
    timestamp: Date.now(),
  });

  inputMessage.value = '';
  await scrollToBottom();

  // 显示AI正在输入状态
  loading.value = true;

  try {
    // 获取AI回复
    const aiResponse = await simulateAiResponse(userContent);

    // 添加AI消息
    messages.value.push({
      content: aiResponse,
      type: 'ai',
      sender: 'AI',
      timestamp: Date.now(),
    });

    await scrollToBottom();
  } catch {
    message.error('AI响应出错，请重试');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Page title="实验功能-本地AI对话">
    <template #description> 孵化阶段,基于 EasyAI 进行的本地模型训练</template>
    <a-card title="AI 对话" :bordered="false">
      <!-- 聊天记录区域 -->
      <div ref="chatRef" class="chat-messages custom-scrollbar">
        <a-list :data-source="messages">
          <template #renderItem="{ item }">
            <a-list-item>
              <!-- 用户消息 -->
              <template v-if="item.type === 'user'">
                <div class="message user-message">
                  <a-space>
                    <a-typography-text>{{ item.content }}</a-typography-text>
                    <a-avatar>{{ item.sender }}</a-avatar>
                  </a-space>
                </div>
              </template>
              <!-- AI消息 -->
              <template v-else>
                <div class="message ai-message">
                  <a-space>
                    <a-avatar>AI</a-avatar>
                    <a-typography-text>{{ item.content }}</a-typography-text>
                  </a-space>
                </div>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input">
        <a-row :gutter="16">
          <a-col :span="20">
            <a-input
              v-model:value="inputMessage"
              placeholder="请输入消息..."
              :disabled="loading"
              @press-enter="sendMessage"
            />
          </a-col>
          <a-col :span="4">
            <a-button
              type="primary"
              :loading="loading"
              block
              @click="sendMessage"
            >
              发送
            </a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </Page>
</template>

<style scoped>
.chat-messages {
  height: 550px;
  overflow-y: auto;
  padding: 20px;
  margin-bottom: 20px;
  background: #f5f5f5;
  border-radius: 4px;
}

.message {
  width: 100%;
}

.user-message {
  text-align: right;
}

.ai-message {
  text-align: left;
}

:deep(.ant-list-item) {
  padding: 8px 0;
  border-bottom: none !important;
}

:deep(.ant-space) {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 8px;
  background: white;
}

.user-message :deep(.ant-space) {
  margin-left: auto;
  background: #1890ff;
}

.user-message :deep(.ant-typography) {
  color: white;
}

.chat-input {
  margin-top: 20px;
}

/* 自定义滚动条样式 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d9d9d9 #f5f5f5;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
</style>
