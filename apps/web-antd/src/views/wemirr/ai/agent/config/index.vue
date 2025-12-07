<script lang="ts" setup name="ChatAgentPage">
import { onMounted, ref } from 'vue';

import { FsIcon, useFs } from '@fast-crud/fast-crud';
import { Avatar, Card, Tag } from 'ant-design-vue';

import AgentAddModal from './components/AgentAddModal.vue';
import createCrudOptions from './crud';

const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: {
    permission: 'ai:agent',
  },
});

onMounted(() => {
  crudExpose.doRefresh();
});

const getAvatarText = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : 'A';
};

function openEdit(opts: any) {
  crudExpose.openEdit(opts);
}

function openView(opts: any) {
  crudExpose.openView(opts);
}

function doRemove(opts: any) {
  crudExpose.doRemove(opts);
}

const showAddModal = ref(false);

function handleAdd() {
  showAddModal.value = true;
}

function handleAddSuccess() {
  showAddModal.value = false;
  crudExpose.doRefresh();
}
</script>

<template>
  <div class="page-container">
    <Card class="agent-page-card w-full" title="智能体管理">
      <fs-crud ref="crudRef" v-bind="crudBinding">
        <template #actionbar-left>
          <a-button type="primary" @click="handleAdd">
            <FsIcon icon="ant-design:plus-outlined" />
            新增智能体
          </a-button>
        </template>

        <div>
          <a-row
            v-if="crudBinding.data"
            :gutter="20"
            style="width: 100%; height: 100%; overflow: auto"
          >
            <a-col
              v-for="(item, index) of crudBinding.data"
              :key="item.id"
              :span="6"
              style="margin-bottom: 20px"
            >
              <a-card class="agent-card" :bordered="false">
                <div class="card-content">
                  <!-- 头像 - 居中显示 -->
                  <div class="agent-avatar-wrapper">
                    <Avatar
                      v-if="item.avatar"
                      :src="item.avatar"
                      :size="64"
                      class="agent-avatar"
                    />
                    <Avatar
                      v-else
                      :size="64"
                      class="agent-avatar default-avatar"
                    >
                      {{ getAvatarText(item.name) }}
                    </Avatar>
                  </div>

                  <!-- 名称 -->
                  <h3 class="agent-name" :title="item.name">
                    {{ item.name }}
                  </h3>

                  <!-- 描述 -->
                  <div class="agent-description" :title="item.description">
                    {{ item.description || '暂无描述' }}
                  </div>

                  <!-- 底部标签 -->
                  <div class="agent-tags">
                    <Tag v-if="item.kbId" color="purple" class="feature-tag">
                      <FsIcon
                        icon="ant-design:database-outlined"
                        style="margin-right: 4px"
                      />
                      知识库
                    </Tag>
                    <Tag v-if="item.tools" color="blue" class="feature-tag">
                      <FsIcon
                        icon="ant-design:tool-outlined"
                        style="margin-right: 4px"
                      />
                      {{ item.tools.length }} 个工具
                    </Tag>
                  </div>
                </div>

                <template #actions>
                  <span
                    class="action-item action-view"
                    @click="openView({ index, row: item })"
                  >
                    <FsIcon icon="ant-design:eye-outlined" />
                    <span class="action-text">查看</span>
                  </span>
                  <span
                    class="action-item action-edit"
                    @click="openEdit({ index, row: item })"
                  >
                    <FsIcon icon="ant-design:edit-outlined" />
                    <span class="action-text">编辑</span>
                  </span>
                  <span
                    class="action-item action-delete"
                    @click="doRemove({ index, row: item })"
                  >
                    <FsIcon icon="ant-design:delete-outlined" />
                    <span class="action-text">删除</span>
                  </span>
                </template>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </fs-crud>
    </Card>

    <!-- 自定义新增组件 -->
    <AgentAddModal
      :visible="showAddModal"
      @update:visible="showAddModal = $event"
      @success="handleAddSuccess"
    />
  </div>
</template>

<style lang="less" scoped>
.page-container {
  display: flex;
  gap: 8px;
  padding: 16px;
  height: 100%;
}

.w-full {
  width: 100%;
}

/deep/.p-4 {
  padding: 8px !important;
}

/deep/.agent-page-card {
  .fs-crud-container {
    min-height: 740px !important;
    max-height: 980px !important;
  }
  .ant-card-body {
    padding: 8px;
  }
}

.agent-card {
  position: relative;
  height: 280px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 24px rgba(24, 144, 255, 0.15);
    transform: translateY(-4px);

    .agent-avatar {
      transform: scale(1.05);
    }
  }

  .ant-card-body {
    padding: 24px;
    height: 100%;
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  text-align: center;
}

.agent-avatar-wrapper {
  margin-bottom: 16px;
}

.agent-avatar {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  &.default-avatar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-size: 24px;
    font-weight: 600;
    color: #fff;
  }
}

.agent-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  line-height: 1.4;
}

.agent-description {
  color: #666;
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  flex: 1;
  width: 100%;
}

.agent-tags {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: auto;

  .feature-tag {
    display: inline-flex;
    align-items: center;
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 12px;
    border: none;
  }
}

:deep(.ant-card-actions) {
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  border-top: 1px solid #f0f0f0;
  border-radius: 0 0 16px 16px;
  padding: 4px 0;

  > li {
    margin: 8px 0;

    .action-item {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      .anticon {
        font-size: 18px;
        transition: all 0.3s ease;
      }

      .action-text {
        font-size: 13px;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      &.action-view {
        color: #52c41a;

        &:hover {
          background: #f6ffed;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(82, 196, 26, 0.2);

          .anticon,
          .action-text {
            color: #389e0d;
          }
        }
      }

      &.action-edit {
        color: #1890ff;

        &:hover {
          background: #e6f7ff;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);

          .anticon,
          .action-text {
            color: #096dd9;
          }
        }
      }

      &.action-delete {
        color: #ff4d4f;

        &:hover {
          background: #fff1f0;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(255, 77, 79, 0.2);

          .anticon,
          .action-text {
            color: #cf1322;
          }
        }
      }
    }

    &:not(:last-child) {
      border-right: 1px solid #e8e8e8;
    }
  }
}

:deep(.fs-actionbar) {
  margin-bottom: 16px;
}

:deep(.fs-search) {
  margin-bottom: 16px;
}
</style>
