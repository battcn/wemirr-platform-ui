<script setup lang="ts">
import type { ChatMessage, ChatSession } from './types/scheam';

import { computed, nextTick, onMounted, ref } from 'vue';

import {
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
  PaperClipOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SendOutlined,
  SettingOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue';

import { mockApi } from './api';
import { MessageContent } from './message-content.js';

const loading = ref(false);
const inputMessage = ref('');
const currentChatId = ref('');
const messageContainer = ref<HTMLElement | null>(null);
const chatList = ref<ChatSession[]>([]);
const currentMessages = ref<ChatMessage[]>([]);
const searchText = ref('');
const showSettings = ref(false);
const contextLength = ref(50);

const filteredChatList = computed(() => {
  if (!searchText.value) return chatList.value;
  const searchKeyword = searchText.value.toLowerCase().trim();

  return chatList.value.filter((chat) => {
    // 搜索标题
    const titleMatch = chat.title.toLowerCase().includes(searchKeyword);

    // 搜索消息内容
    const contentMatch = chat.messages?.some((message) =>
      message.content.toLowerCase().includes(searchKeyword),
    );

    // 搜索最后一条消息
    const lastMessageMatch = chat.lastMessage
      ?.toLowerCase()
      .includes(searchKeyword);

    return titleMatch || contentMatch || lastMessageMatch;
  });
});

// 修改欢迎消息的构建方式
const buildWelcomeMessage = () => {
  const examples = [
    '用js写一个for循环',
    '说一下三体小说的梗概',
    '写一首关于夏天的七言绝句',
    '请你扮演一个柏拉图式的老师，教我分析和解决问题，我的第一个问题是：14*34-18=?',
  ];

  return {
    id: '1',
    type: 'ai' as const,
    content: `你好！我是 WP AI，我可以回答您的任何问题。我还会写代码，查看代码中的问题，帮你分析代码等。\n如果您不知道问什么，以下是一些示例，你可以直接点击尝试：\n${examples.map((example) => `• ${example}`).join('\n')}`,
    time: new Date().toLocaleTimeString(),
    examples,
  };
};
// 添加滚动到底部的方法
const scrollToBottom = () => {
  if (messageContainer.value) {
    nextTick(() => {
      const container = messageContainer.value;
      container?.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    });
  }
};

// 创建新会话
const createNewChat = async () => {
  try {
    currentChatId.value = '';
    currentMessages.value = [buildWelcomeMessage()];
    scrollToBottom();
  } catch (error) {
    console.error('创建新会话失败:', error);
  }
};

// 初始化数据
const initData = async () => {
  try {
    // 获取会话列表
    chatList.value = await mockApi.getSessionList();
    // 默认创建新对话
    await createNewChat();
  } catch (error) {
    console.error('初始化数据失败:', error);
  }
};

// 切换会话
const switchChat = async (chatId: string) => {
  try {
    currentChatId.value = chatId;
    currentMessages.value = await mockApi.getSessionMessages(chatId);
    scrollToBottom();
  } catch (error) {
    console.error('切换会话失败:', error);
  }
};

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim()) return;

  try {
    loading.value = true;

    // 如果是新对话且还没有发送过消息，先创建会话
    if (!currentChatId.value || currentMessages.value.length <= 1) {
      // 使用用户的第一条消息作为会话标题（截取一部分）
      const title =
        inputMessage.value.slice(0, 20) +
        (inputMessage.value.length > 20 ? '...' : '');
      const newSession = await mockApi.createSession(title);
      chatList.value.unshift(newSession);
      currentChatId.value = newSession.id;
    }

    // 发送用户消息
    const userMessage = await mockApi.sendMessage(
      currentChatId.value,
      inputMessage.value,
    );
    currentMessages.value.push(userMessage);
    inputMessage.value = '';
    scrollToBottom();

    // 获取AI回复
    const aiMessage = await mockApi.getAiResponse(
      currentChatId.value,
      userMessage.content,
    );
    currentMessages.value.push(aiMessage);

    // 更新会话列表中的最后一条消息
    const currentChat = chatList.value.find(
      (chat) => chat.id === currentChatId.value,
    );
    if (currentChat) {
      currentChat.lastMessage = aiMessage.content;
      currentChat.timestamp = Date.now();
    }
  } catch (error) {
    console.error('发送消息失败:', error);
  } finally {
    loading.value = false;
    scrollToBottom();
  }
};

// 删除会话
const deleteChat = async (index: number) => {
  try {
    const chatItem = chatList.value[index];
    if (!chatItem) return; // 添加空值检查
    const sessionId = chatItem.id;
    await mockApi.deleteSession(sessionId);
    chatList.value.splice(index, 1);
    await (chatList.value.length > 0
      ? switchChat(chatItem.id)
      : createNewChat());
  } catch (error) {
    console.error('删除会话失败:', error);
  }
};

// 修改编辑标题方法
const editTitle = (index: number) => {
  const chatItem = chatList.value[index];
  if (!chatItem) return; // 添加空值检查
  if (!chatItem.isEditing) {
    // 先将其他正在编辑的项关闭
    chatList.value.forEach((item) => {
      item.isEditing = false;
    });
    // 开启当前项的编辑状态
    chatItem.isEditing = true;
    // 下一个tick后聚焦输入框
    nextTick(() => {
      const input = document.querySelector(
        '.title-input input',
      ) as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    });
  }
};

// 修改保存标题方法
const saveTitle = async (index: number) => {
  try {
    const chatItem = chatList.value[index];
    if (!chatItem) return; // 添加空值检查
    if (!chatItem.title.trim()) {
      chatItem.title = '新的对话';
    }
    await mockApi.updateSessionTitle(chatItem.id, chatItem.title);
    chatItem.isEditing = false;
  } catch (error) {
    console.error('保存标题失败:', error);
  }
};

// 组件挂载时初始化数据
onMounted(() => {
  initData();
});

// 处理设置保存
const handleSettingsSave = () => {
  // 这里可以添加设置保存的逻辑
  showSettings.value = false;
};
</script>

<template>
  <a-layout class="chat-layout">
    <!-- 左侧对话列表 -->
    <a-layout-sider width="260" class="chat-sider">
      <!-- 返回首页 -->
      <div class="sider-header">
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索对话"
          class="search-input"
          allow-clear
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input-search>
      </div>

      <!-- 新的对话按钮 -->
      <div class="new-chat-container">
        <a-button class="new-chat-button" block @click="createNewChat">
          <PlusOutlined />
          <span>新的对话</span>
        </a-button>
      </div>

      <!-- 对话列表容器 -->
      <a-list :data-source="filteredChatList" class="chat-list" pagination>
        <template #renderItem="{ item, index }">
          <a-list-item
            class="chat-item"
            :class="[{ active: currentChatId === item.id }]"
            @click="switchChat(item.id)"
          >
            <div class="chat-item-content">
              <MessageOutlined />
              <!-- 编辑状态 -->
              <template v-if="item.isEditing">
                <a-input
                  v-model:value="item.title"
                  size="small"
                  class="title-input"
                  @press-enter="saveTitle(index)"
                  @blur="saveTitle(index)"
                  @click.stop
                />
              </template>
              <!-- 非编辑状态 -->
              <template v-else>
                <a-tooltip v-if="item.title.length > 15" :title="item.title">
                  <span class="chat-title">{{ item.title }}</span>
                </a-tooltip>
                <span v-else class="chat-title">{{ item.title }}</span>
              </template>
            </div>
            <div
              class="chat-item-actions"
              v-show="currentChatId === item.id || item.isEditing"
            >
              <a-button type="text" size="small" @click.stop="editTitle(index)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                title="确定要删除这个对话吗？"
                @confirm="deleteChat(index)"
                @click.stop
              >
                <a-button type="text" size="small">
                  <DeleteOutlined />
                </a-button>
              </a-popconfirm>
            </div>
          </a-list-item>
        </template>
      </a-list>
    </a-layout-sider>

    <!-- 右侧聊天区域 -->
    <a-layout-content class="chat-content">
      <!-- 聊天头部 -->
      <div class="chat-header">
        <a-space>
          <span class="model-tag">当前模型: WP 0.5 </span>
          <span class="price-tag">
            <a-tag color="blue">更新</a-tag>
          </span>
        </a-space>
      </div>

      <!-- 聊天消息区域 -->
      <div ref="messageContainer" class="message-container custom-scrollbar">
        <a-list :data-source="currentMessages">
          <template #renderItem="{ item }">
            <a-list-item>
              <div
                class="message"
                :class="[item.type === 'ai' ? 'ai-message' : 'user-message']"
              >
                <a-space>
                  <a-avatar>{{ item.type === 'ai' ? 'AI' : '我' }}</a-avatar>
                  <div class="message-content">
                    <div class="message-time">{{ item.time }}</div>
                    <MessageContent
                      :message="item"
                      @select-example="
                        (question) => {
                          inputMessage = question;
                          sendMessage();
                        }
                      "
                    />
                  </div>
                </a-space>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </div>

      <!-- 输入区域 -->
      <div class="input-container">
        <div class="input-wrapper">
          <a-textarea
            v-model:value="inputMessage"
            :rows="3"
            placeholder="请输入一个问题，Ctrl+Enter发行，Enter发送消息"
            :disabled="loading"
            @press-enter.prevent="sendMessage"
          />
          <div class="input-toolbar">
            <a-space>
              <a-button type="text">
                <template #icon><PlusOutlined /></template>
              </a-button>
              <a-button type="text">
                <template #icon><PaperClipOutlined /></template>
              </a-button>
              <a-button type="text">
                <template #icon><SmileOutlined /></template>
              </a-button>
              <a-popconfirm
                :show-cancel="false"
                @confirm="handleSettingsSave"
                :overlay-style="{ width: '320px' }"
              >
                <template #title>
                  <div class="setting-label">
                    <span>上下文长度</span>
                    <a-tooltip title="设置AI回复时参考的历史消息长度">
                      <QuestionCircleOutlined />
                    </a-tooltip>
                  </div>
                  <div class="setting-item">
                    <div class="context-slider">
                      <a-slider
                        v-model:value="contextLength"
                        :marks="{
                          0: '',
                          25: '问短回长',
                          50: '问回相当',
                          75: '问长回短',
                          100: '',
                        }"
                        :step="1"
                      />
                      <div class="slider-info">
                        <span>上下文+问题 = {{ 6320 }}</span>
                        <span>回复 = {{ 5680 }}</span>
                      </div>
                    </div>
                  </div>
                </template>
                <a-button type="text">
                  <template #icon><SettingOutlined /></template>
                </a-button>
              </a-popconfirm>
            </a-space>
            <a-button
              type="primary"
              :loading="loading"
              @click="sendMessage"
              class="send-button"
            >
              <template #icon><SendOutlined /></template>
              发送
            </a-button>
          </div>
        </div>
      </div>
    </a-layout-content>
  </a-layout>

  <!-- 添加设置弹窗 -->
  <a-modal
    v-model:open="showSettings"
    title="对话设置"
    @ok="handleSettingsSave"
    @cancel="showSettings = false"
    :mask-closable="false"
    width="500px"
  >
    <div class="settings-content">
      <div class="setting-label">
        <span>上下文设置</span>
        <a-tooltip title="设置AI回复时参考的历史消息长度">
          <QuestionCircleOutlined />
        </a-tooltip>
      </div>
      <div class="context-slider">
        <a-slider
          v-model:value="contextLength"
          :marks="{
            0: '问短回长',
            50: '问回相当',
            100: '问长回短',
          }"
          :step="1"
        />
        <div class="slider-info">
          <span>上下文+问题 = {{ 6320 }}</span>
          <span>回复 = {{ 5680 }}</span>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<style scoped lang="less">


@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/deep/ .ant-list-item {
  border-block-end: 0 !important;
}

.chat-layout {
  height: calc(100vh - 250px);
  background: #fff;
}

.chat-sider {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 250px);
  overflow: hidden;
  background: #fff;
  border-right: 1px solid #f0f0f0;
}

.sider-header {
  flex-shrink: 0;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.back-button {
  height: auto;
  padding: 0;
  color: #1890ff;

  :deep(.anticon) {
    margin-right: 8px;
  }
}

.new-chat-container {
  flex-shrink: 0;
  padding: 8px 16px;
  margin-bottom: 4px;
}

.new-chat-button {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  height: 44px;
  color: #595959;
  background: transparent;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  transition: all 0.3s;

  &:hover {
    color: #40a9ff;
    border-color: #40a9ff;
  }

  :deep(.anticon) {
    font-size: 16px;
  }
}

.chat-list {
  height: 100%;
  padding: 8px 16px;
}

.chat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 12px !important;
  margin: 4px 0;
  cursor: pointer;
  background: #fff;
  border: 1px solid #d9d9d9 !important;
  border-radius: 6px;
  transition: all 0.3s;
}

.chat-item-content {
  display: flex;
  flex: 1;
  gap: 8px;
  align-items: center;
  min-width: 0;
  padding-right: 8px;
}

.title-input {
  flex: 1;
  width: 100%;
  min-width: 120px;

  :deep(.ant-input) {
    height: 28px;
    padding: 0 8px;
  }
}

.chat-title {
  flex: 1;
  min-width: 0;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  white-space: nowrap;
}

.chat-item-actions {
  display: none;
  flex-shrink: 0;
  gap: 4px;
}

.chat-item:hover .chat-item-actions,
.chat-item.active .chat-item-actions {
  display: flex;
}

/* 确保输入框样式正确 */
:deep(.ant-input) {
  border-radius: 4px;

  &:focus {
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
  }
}

.chat-content {
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.message-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.message {
  max-width: 80%;
  margin: 8px 0;
  opacity: 0;
  transform: translateY(20px);
  animation: messageIn 0.3s ease forwards;
}

.ai-message {
  margin-right: auto;
  animation-delay: 0.1s;
}

.user-message {
  margin-left: auto;
  animation-delay: 0s;
}

.message-content {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
    transform: translateY(-2px);
  }
}

.message-time {
  margin-bottom: 4px;
  font-size: 12px;
  color: #999;
}

.input-container {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.input-wrapper {
  position: relative;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 8px;

  :deep(.ant-input) {
    padding-bottom: 40px;
    resize: none;
    border: none;

    &:focus {
      box-shadow: none;
    }
  }
}

.input-toolbar {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
}

.send-button {
  margin-left: auto;
}

.active {
  background: #e6f7ff;
}

/* 自定义滚动条样式 */
.custom-scrollbar {
  scrollbar-color: #d9d9d9 #f5f5f5;

  /* Firefox */
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    display: block;
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 3px;

    &:hover {
      background: #bfbfbf;
    }
  }
}

.search-input {
  :deep(.ant-input-affix-wrapper) {
    border-radius: 6px;

    &:hover,
    &:focus {
      border-color: #40a9ff;
    }
  }

  :deep(.ant-input-prefix) {
    margin-right: 8px;
    color: #999;
  }

  :deep(.ant-input) {
    &::placeholder {
      color: #999;
    }
  }
}

:deep(.ant-tooltip) {
  .ant-tooltip-inner {
    max-width: 300px;
    word-break: break-all;
  }
}

.message-content {
  :deep(.example-link) {
    color: #1890ff;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #40a9ff;
      text-decoration: underline;
    }
  }
}

/* 修改示例链接样式 */
.message-text :deep(.example-item) {
  position: relative;
  padding-left: 8px;
  margin: 8px 0;
  color: #1890ff;
}

.message-text :deep(.example-text) {
  display: block;
  padding: 8px 12px;
  color: #1890ff;
  text-decoration: none;
  cursor: pointer;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 2px 8px rgb(24 144 255 / 10%);
    transform: translateX(8px);
  }
}

.message-text :deep(.example-text:hover) {
  color: #40a9ff;
  text-decoration: none;
  background: #f0f7ff;
  border-color: #40a9ff;
  transform: translateX(4px);
}

/* 确保链接样式不被覆盖 */
.message-text :deep(a.example-text) {
  color: #1890ff !important;
  text-decoration: none !important;
}

.message-text :deep(a.example-text:hover) {
  color: #40a9ff !important;
}

.settings-content {
  padding: 16px;
}

.setting-item {
  padding: 8px 0;
}

.setting-label {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.context-slider {
  :deep(.ant-slider) {
    margin: 8px 28px 16px 0;
  }

  :deep(.ant-slider-mark-text) {
    font-size: 12px;
    color: #666;
  }

  :deep(.ant-slider-track) {
    background-color: #52c41a;
  }

  :deep(.ant-slider-handle) {
    border-color: #52c41a;

    &:hover {
      border-color: #73d13d;
    }
  }
}

.slider-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

:deep(.ant-popover-message-title) {
  padding-left: 0;
}
</style>
