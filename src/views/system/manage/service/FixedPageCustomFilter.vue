<template>
  <PageWrapper
    @back="goBack"
    :title="'服务过滤器' + (params.serviceName ? `(${params.serviceName})` : '')"
    :contentClass="prefixCls"
    contentBackground
    contentFullHeight
  >
    <template #extra>
      <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate">
        新增过滤器
      </a-button>
      <a-button type="primary" @click="getCustomFilters" :loading="loading"> 查询 </a-button>
    </template>
    <div>
      <a-row type="flex" justify="start" :gutter="8" v-if="serviceCustomFilter.array.length > 0">
        <div v-for="filterInfo in serviceCustomFilter.array" :key="filterInfo.customFilterId">
          <a-col :span="6">
            <a-card
              hoverable
              :style="
                'width: 300px; margin: 10px;' +
                (filterInfo.filterStatus == 0 ? 'border:1px solid #ffd591' : '')
              "
              :title="filterInfo.filterName + '(' + filterInfo.filterTypeName + ')'"
            >
              <template #actions>
                <a-tooltip placement="bottom" title="详情">
                  <InfoCircleOutlined key="info" @click="handleView(filterInfo.customFilterId)" />
                </a-tooltip>
                <a-tooltip placement="bottom" title="编辑" @click="handleEdit(filterInfo)">
                  <EditOutlined key="edit" style="color: #1890ff" />
                </a-tooltip>
                <a-tooltip
                  placement="bottom"
                  title="删除"
                  @click="handleDelete(filterInfo.customFilterId)"
                >
                  <DeleteOutlined key="delete" style="color: #ff7875" />
                </a-tooltip>
              </template>
              <div style="display: flex; flex-direction: column; justify-content: space-between">
                <div>
                  <a-form :layout="'vertical'" :label-col="{ span: 24 }">
                    <a-form-item
                      label="白名单"
                      v-if="filterInfo.whiteSpecialUrls && filterInfo.whiteSpecialUrls.length > 0"
                    >
                      <div style="display: flex; flex-wrap: wrap; margin-left: 8px">
                        <Popover
                          placement="bottomRight"
                          v-for="urlInfo in filterInfo.whiteSpecialUrls"
                          :key="urlInfo.specialUrlId"
                        >
                          <template #content>
                            <div>{{ urlInfo.url || '---' }}</div>
                          </template>
                          <a-tag
                            v-if="urlInfo.urlName && urlInfo.urlName?.length > 4"
                            color="processing"
                            class="white-list-content"
                          >
                            {{ `${urlInfo.urlName.slice(0, 4)}...` }}
                          </a-tag>
                          <a-tag v-else color="processing" class="white-list-content">
                            {{ urlInfo.urlName || '---' }}
                          </a-tag>
                        </Popover>
                      </div>
                    </a-form-item>
                    <a-form-item
                      label="黑名单"
                      v-if="filterInfo.blackSpecialUrls && filterInfo.blackSpecialUrls.length > 0"
                    >
                      <div style="display: flex; flex-wrap: wrap; margin-left: 8px">
                        <Popover
                          placement="bottomRight"
                          v-for="urlInfo in filterInfo.blackSpecialUrls"
                          :key="urlInfo.specialUrlId"
                        >
                          <template #content>
                            <div>{{ urlInfo.url || '---' }}</div>
                          </template>
                          <a-tag
                            v-if="urlInfo.urlName && urlInfo.urlName?.length > 4"
                            color="warning"
                            class="white-list-content"
                          >
                            {{ `${urlInfo.urlName.slice(0, 4)}...` }}
                          </a-tag>
                          <a-tag v-else color="warning" class="white-list-content">
                            {{ urlInfo.urlName || '---' }}
                          </a-tag>
                        </Popover>
                      </div>
                    </a-form-item>
                    <a-form-item label="状态:">
                      <div style="margin-left: 8px">
                        <a-radio-group
                          button-style="solid"
                          @change="
                            handleChangeStatus(filterInfo.customFilterId, filterInfo.filterStatus)
                          "
                          size="small"
                          v-model:value="filterInfo.filterStatus"
                        >
                          <a-radio-button :value="1">启用</a-radio-button>
                          <a-radio-button :value="0">禁用</a-radio-button>
                        </a-radio-group>
                      </div>
                    </a-form-item>
                  </a-form>
                </div>
                <div style="margin-top: 8px">
                  <a-row type="flex" justify="space-around">
                    <a-col :span="12">{{ filterInfo.createUserName }}</a-col>
                    <a-col :span="12">{{ filterInfo.createTime }}</a-col>
                  </a-row>
                </div>
              </div>
            </a-card>
          </a-col>
        </div>
      </a-row>
      <div v-else>
        <a-empty />
      </div>
    </div>
    <ModalCustomFilter @register="registerModal" @success="getCustomFilters" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { InfoCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { Popover } from 'ant-design-vue';
  import { useRoute, useRouter } from 'vue-router';
  import ModalCustomFilter from './ModalCustomFilter.vue';
  import { ref, reactive, onMounted } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { ManageCustomFilterDto } from '/@/api/modules/system/manage/model/manageCustomFilterModel';
  import {
    selectList,
    updateStatus,
    deleteById,
  } from '/@/api/modules/system/manage/manageCustomFilter';
  import { useDesign } from '/@/hooks/web/useDesign';
  const [registerModal, { openModal }] = useModal();
  const { prefixCls } = useDesign('custom-filter');
  const { closeCurrent } = useTabs();
  const route = useRoute();
  const params = reactive(route.query);
  const router = useRouter();
  const loading = ref(false);
  const serviceCustomFilter = reactive({
    array: [] as ManageCustomFilterDto[],
  });
  function goBack() {
    closeCurrent();
    router.back();
  }
  async function getCustomFilters() {
    loading.value = true;
    try {
      serviceCustomFilter.array = (await selectList(params.serviceId)) || [];
    } finally {
      loading.value = false;
    }
  }
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
      serviceId: params.serviceId,
    });
  }
  async function handleChangeStatus(customFilterId: string, state: number) {
    await updateStatus(customFilterId, state);
    getCustomFilters();
  }
  function handleView(customFilterId: string) {
    console.log('------handleView---------', customFilterId);
  }
  function handleEdit(filterInfo: ManageCustomFilterDto) {
    openModal(true, {
      isUpdate: true,
      serviceId: params.serviceId,
      customFilterId: filterInfo.customFilterId,
    });
  }
  async function handleDelete(customFilterId: string) {
    await deleteById(customFilterId);
    getCustomFilters();
  }
  onMounted(() => {
    getCustomFilters();
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-custom-filter';
  .@{prefix-cls} {
    padding: 10px;

    .ant-card-head {
      min-height: 36px;

      .ant-card-head-title {
        padding: 5px 0;
      }
    }

    .ant-card-actions > li {
      margin: 5px 0;
    }

    .ant-card-body {
      padding: 8px;

      .ant-form-item {
        margin-bottom: 8px;

        .ant-form-item-label {
          font-weight: 500;
        }
      }

      .white-list-content {
        margin-bottom: 4px;
      }
    }
  }
</style>
