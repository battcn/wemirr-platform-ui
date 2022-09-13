<template>
  <PageWrapper
    @back="goBack"
    :title="'服务路由' + (params.serviceName ? `(${params.serviceName})` : '')"
    :contentClass="prefixCls"
    contentBackground
    contentFullHeight
  >
    <template #extra>
      <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate">
        新增路由
      </a-button>
      <a-button type="primary" @click="getAllServiceRoute" :loading="loading"> 查询 </a-button>
    </template>
    <div>
      <a-row type="flex" justify="start" :gutter="8" v-if="serviceRoutes.array.length > 0">
        <div v-for="serviceRoute in serviceRoutes.array" :key="serviceRoute.routeId">
          <a-col :span="6">
            <a-card
              hoverable
              :style="
                'width: 300px; margin: 10px;' +
                (serviceRoute.routeState == 0 ? 'border:1px solid #ffd591' : '')
              "
              :title="serviceRoute.routeName + '(' + serviceRoute.routeCode + ')'"
            >
              <template #actions>
                <a-tooltip placement="bottom" title="详情">
                  <InfoCircleOutlined key="info" @click="handleView(serviceRoute.routeId)" />
                </a-tooltip>
                <a-tooltip placement="bottom" title="编辑" @click="handleEdit(serviceRoute)">
                  <EditOutlined key="edit" style="color: #1890ff" />
                </a-tooltip>
                <a-tooltip
                  placement="bottom"
                  title="删除"
                  @click="handleDelete(serviceRoute.routeId)"
                >
                  <DeleteOutlined key="delete" style="color: #ff7875" />
                </a-tooltip>
              </template>
              <div style="display: flex; flex-direction: column; justify-content: space-between">
                <div>
                  <a-form :layout="'vertical'" :label-col="{ span: 24 }">
                    <a-form-item
                      label="路由断言:"
                      v-if="serviceRoute.routePredicates && serviceRoute.routePredicates.length > 0"
                    >
                      <div style="display: flex; flex-wrap: wrap; margin-left: 8px">
                        <Popover
                          placement="bottomRight"
                          v-for="routePredicate in serviceRoute.routePredicates"
                          :key="routePredicate.predicateId"
                        >
                          <template #content>
                            <div>
                              {{ routePredicate['predicateName'] }}
                              {{ '(' + routePredicate['predicateTypeName'] + ')' }}
                              {{ ':' + JSON.stringify(routePredicate['rules']) || '---' }}
                            </div>
                          </template>
                          <a-tag
                            v-if="routePredicate['predicateName'].length > 6"
                            color="processing"
                            style="margin-bottom: 4px; cursor: pointer"
                          >
                            {{ `${routePredicate['predicateName'].slice(0, 6)}...` }}
                          </a-tag>
                          <a-tag
                            v-else
                            style="margin-bottom: 4px; cursor: pointer"
                            color="processing"
                          >
                            {{ routePredicate['predicateName'] || '--' }}
                          </a-tag>
                        </Popover>
                      </div>
                    </a-form-item>

                    <a-form-item
                      label="路由过滤器:"
                      v-if="serviceRoute.routeFilters && serviceRoute.routeFilters.length > 0"
                    >
                      <div style="display: flex; flex-wrap: wrap; margin-left: 8px">
                        <Popover
                          placement="bottomRight"
                          v-for="routeFilter in serviceRoute.routeFilters"
                          :key="routeFilter.filterId"
                        >
                          <template #content>
                            <div>
                              {{ routeFilter['filterName'] }}
                              {{ '(' + routeFilter['filterTypeName'] + ')' }}
                              {{ ':' + JSON.stringify(routeFilter['rules']) || '---' }}
                            </div>
                          </template>
                          <a-tag
                            v-if="routeFilter['filterName'].length > 6"
                            color="warning"
                            style="margin-bottom: 4px; cursor: pointer"
                          >
                            {{ `${routeFilter['filterName'].slice(0, 6)}...` }}
                          </a-tag>
                          <a-tag v-else style="margin-bottom: 8px; cursor: pointer" color="warning">
                            {{ routeFilter['filterName'] || '--' }}
                          </a-tag>
                        </Popover>
                      </div>
                    </a-form-item>
                    <a-form-item
                      label="服务过滤器"
                      v-if="serviceRoute.customFilters && serviceRoute.customFilters.length > 0"
                    >
                      <div style="display: flex; flex-wrap: wrap; margin-left: 8px">
                        <Popover
                          placement="bottomRight"
                          v-for="customFilter in serviceRoute.customFilters"
                          :key="customFilter.customFilterId"
                        >
                          <template #content>
                            <div>
                              {{ customFilter['filterName'] }}
                              {{ '(' + customFilter['filterTypeName'] + ')' }}
                            </div>
                          </template>
                          <a-tag
                            v-if="customFilter['filterName'].length > 6"
                            color="error"
                            style="margin-bottom: 4px; cursor: pointer"
                          >
                            {{ `${customFilter['filterName'].slice(0, 6)}...` }}
                          </a-tag>
                          <a-tag v-else style="margin-bottom: 8px; cursor: pointer" color="error">
                            {{ customFilter['filterName'] || '--' }}
                          </a-tag>
                        </Popover>
                      </div>
                    </a-form-item>

                    <a-form-item label="状态:">
                      <div style="margin-left: 8px">
                        <a-radio-group
                          button-style="solid"
                          @change="
                            handleChangeStatus(serviceRoute.routeId, serviceRoute.routeState)
                          "
                          size="small"
                          v-model:value="serviceRoute.routeState"
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
                    <a-col :span="12">{{ serviceRoute.createUserName }}</a-col>
                    <a-col :span="12">{{ serviceRoute.createTime }}</a-col>
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
    <ModalServiceRouter @register="registerModal" @success="getAllServiceRoute" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { InfoCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { Popover } from 'ant-design-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ref, reactive, onMounted } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { selectList, updateStatus, deleteById } from '/@/api/modules/system/manage/manageRoute';
  import { ManageRouteDto } from '/@/api/modules/system/manage/model/manageRouteModel';
  import ModalServiceRouter from './ModalServiceRouter.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  const [registerModal, { openModal }] = useModal();
  const { prefixCls } = useDesign('service-router');
  const { closeCurrent } = useTabs();
  const route = useRoute();
  const params = reactive(route.query);
  const router = useRouter();
  const loading = ref(false);
  const serviceRoutes = reactive({
    array: [] as ManageRouteDto[],
  });
  function goBack() {
    closeCurrent();
    router.back();
  }
  async function getAllServiceRoute() {
    loading.value = true;
    try {
      serviceRoutes.array = (await selectList(params.serviceId)) || [];
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
  async function handleChangeStatus(routeId: string, state: number) {
    await updateStatus(routeId, state);
    getAllServiceRoute();
  }
  function handleView(routeId: string) {
    console.log('------handleView---------', routeId);
  }
  function handleEdit(routerInfo: ManageRouteDto) {
    openModal(true, {
      isUpdate: true,
      routeId: routerInfo.routeId,
    });
  }
  async function handleDelete(routeId: string) {
    await deleteById(routeId);
    getAllServiceRoute();
  }
  onMounted(() => {
    getAllServiceRoute();
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-service-router';
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
