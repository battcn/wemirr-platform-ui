<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="60%"
    :min-height="300"
  >
    <div style="padding-right: 30px">
      <a-form :label-col="labelCol" :model="routerInfos.routerInfo" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="路由名称"
              name="routeName"
              :rules="[
                {
                  required: true,
                  message: '请输入路由名称',
                  trigger: ['change', 'blur'],
                },
              ]"
            >
              <a-input
                v-model:value="routerInfos.routerInfo.routeName"
                allowClear
                placeholder="请输入路由名称"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item
              label="路由编码"
              :rules="[
                {
                  required: true,
                  message: '请输入路由编码',
                  trigger: ['change', 'blur'],
                },
              ]"
              name="routeCode"
              help="全系统唯一,使用在网关动态路由中"
              validateStatus="warning"
            >
              <a-input
                v-model:value="routerInfos.routerInfo.routeCode"
                allowClear
                placeholder="请输入路由编码"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              help="来源于服务配置，用于网关路由转发配置"
              label="负载均衡器"
              name="isLoadBalancer"
            >
              <a-radio-group
                v-model:value="routerInfos.routerInfo.isLoadBalancer"
                button-style="solid"
                disabled
              >
                <a-radio-button value="0">不是</a-radio-button>
                <a-radio-button value="1">是</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="routerInfos.routerInfo.isLoadBalancer == 1">
            <a-form-item
              label="均衡器类型"
              name="loadBalancerType"
              :rules="[
                {
                  required: true,
                  message: '请选择均衡器类型',
                  trigger: ['change', 'blur'],
                },
              ]"
            >
              <a-select
                style="width: 100%"
                placeholder="请选择均衡器类型"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                v-model:value="routerInfos.routerInfo.loadBalancerType"
                :options="
                  routerInfos.lbType.map((item) => ({
                    value: item.type,
                    label: item.typeName,
                  }))
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="routerInfos.routerInfo.isLoadBalancer == 1">
            <a-form-item
              label="服务编码"
              name="serviceCode"
              :rules="[
                {
                  required: true,
                  message: '请输入服务编码',
                  trigger: ['change', 'blur'],
                },
              ]"
            >
              <a-input
                disabled
                v-model:value="routerInfos.routerInfo.serviceCode"
                placeholder="请输入服务编码"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12" v-else>
            <a-form-item
              label="路由url地址"
              name="url"
              :rules="[
                {
                  required: true,
                  message: '请输入路由url地址',
                  trigger: ['change', 'blur'],
                },
              ]"
            >
              <a-textarea
                v-model:value="routerInfos.routerInfo.url"
                allowClear
                placeholder="请输入路由url地址"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="路由状态" name="routeState">
              <a-radio-group v-model:value="routerInfos.routerInfo.routeState" button-style="solid">
                <a-radio-button :value="0">禁用</a-radio-button>
                <a-radio-button :value="1">启用</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="服务过滤器" name="customFilterIds">
              <a-select
                style="width: 100%"
                placeholder="请选择服务过滤器"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                v-model:value="routerInfos.routerInfo.customFilterIds"
                mode="multiple"
                :options="
                  routerInfos.customFilters.map((item) => ({
                    value: item.customFilterId,
                    label: item.filterName + '(' + item.filterTypeName + ')',
                  }))
                "
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="路由排序" name="routeOrder">
              <a-input-number
                style="width: 100%"
                v-model:value="routerInfos.routerInfo.routeOrder"
                allowClear
                placeholder="请输入路由排序"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="路由元数据" name="metadata">
              <a-textarea
                v-model:value="routerInfos.routerInfo.metadata"
                allowClear
                placeholder="请输入路由元数据"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="备注" name="remark">
              <a-textarea
                v-model:value="routerInfos.routerInfo.remark"
                allowClear
                placeholder="请输入备注"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-row :gutter="16">
      <a-col :span="12">
        <a-divider dashed style="border-color: #7cb305">断言</a-divider>
        <div style="margin: 0 10px" :class="prefixCls">
          <div
            style="display: flex; flex-wrap: wrap; margin-left: 8px"
            v-if="
              routerInfos.routePredicates && Object.keys(routerInfos.routePredicates).length > 0
            "
          >
            <Popover
              placement="bottomRight"
              v-for="item in Object.keys(routerInfos.routePredicates)"
              :key="item"
            >
              <template #content>
                <div>
                  {{ routerInfos.routePredicates[item]['predicateName'] }}
                  {{ '(' + routerInfos.routePredicates[item]['predicateTypeName'] + ')' }}
                  {{ ':' + JSON.stringify(routerInfos.routePredicates[item]['rules']) || '---' }}
                </div>
              </template>
              <a-tag
                v-if="
                  routerInfos.routePredicates[item]['predicateName'] &&
                  routerInfos.routePredicates[item]['predicateName'].length > 6
                "
                color="processing"
                closable
                style="margin-bottom: 4px; cursor: pointer"
                @close="handelRemovePredicate(item)"
                @click="handelEditPredicate(routerInfos.routePredicates[item])"
              >
                {{ `${routerInfos.routePredicates[item]['predicateName'].slice(0, 6)}...` }}
              </a-tag>
              <a-tag
                v-else
                closable
                style="margin-bottom: 4px; cursor: pointer"
                @close="handelRemovePredicate(item)"
                @click="handelEditPredicate(routerInfos.routePredicates[item])"
                color="processing"
              >
                {{ routerInfos.routePredicates[item]['predicateName'] || '--' }}
              </a-tag>
            </Popover>
          </div>
          <div v-else>
            <a-empty />
          </div>
          <a-button block class="mt-5" type="dashed" @click="handelAddPredicate">
            新增断言
          </a-button>
        </div>
      </a-col>
      <a-col :span="12">
        <a-divider dashed style="border-color: #7cb305">过滤器</a-divider>
        <div style="margin: 0 10px" :class="prefixCls">
          <div
            style="display: flex; flex-wrap: wrap; margin-left: 8px"
            v-if="routerInfos.routeFilters && Object.keys(routerInfos.routeFilters).length > 0"
          >
            <Popover
              placement="bottomRight"
              v-for="item in Object.keys(routerInfos.routeFilters)"
              :key="item"
            >
              <template #content>
                <div>
                  {{ routerInfos.routeFilters[item]['filterName'] }}
                  {{ '(' + routerInfos.routeFilters[item]['filterTypeName'] + ')' }}
                  {{ ':' + JSON.stringify(routerInfos.routeFilters[item]['rules']) || '---' }}
                </div>
              </template>
              <a-tag
                v-if="
                  routerInfos.routeFilters[item]['filterName'] &&
                  routerInfos.routeFilters[item]['filterName'].length > 6
                "
                color="warning"
                closable
                style="margin-bottom: 8px; cursor: pointer"
                @close="handelRemoveFilter(item)"
                @click="handelEditFilter(routerInfos.routeFilters[item])"
              >
                {{ `${routerInfos.routeFilters[item]['filterName'].slice(0, 6)}...` }}
              </a-tag>
              <a-tag
                v-else
                closable
                style="margin-bottom: 8px; cursor: pointer"
                @close="handelRemoveFilter(item)"
                @click="handelEditFilter(routerInfos.routeFilters[item])"
                color="warning"
              >
                {{ routerInfos.routeFilters[item]['filterName'] || '--' }}
              </a-tag>
            </Popover>
          </div>
          <div v-else>
            <a-empty />
          </div>
          <a-button block class="mt-5" type="dashed" @click="handelAddFilter">
            新增过滤器
          </a-button>
        </div>
      </a-col>
    </a-row>
    <ModalRouterFilter @register="registerFilterModal" @success="handleFilterSeccess" />
    <ModalRouterPredicate @register="registerPredicateModal" @success="handlePredicateSeccess" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { Popover } from 'ant-design-vue';
  import { useRoute } from 'vue-router';
  import { ref, computed, unref, reactive, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getListByConstantTypes } from '/@/api/modules/system/common/commonConstant';
  import ModalRouterFilter from './ModalRouterFilter.vue';
  import { useModal } from '/@/components/Modal';
  const [registerFilterModal, { openModal: openFilterModal }] = useModal();
  const [registerPredicateModal, { openModal: openPredicateModal }] = useModal();
  import ModalRouterPredicate from './ModalRouterPredicate.vue';
  import { getById, insert, update } from '/@/api/modules/system/manage/manageRoute';
  import { selectSimpleList } from '/@/api/modules/system/manage/manageCustomFilter';
  import { useDesign } from '/@/hooks/web/useDesign';
  const { prefixCls } = useDesign('modal-router-detail');
  const emit = defineEmits(['success', 'register']);
  const route = useRoute();
  const params = reactive(route.query);
  const isUpdate = ref(true);
  const formRef = ref();
  const routeId = ref('');
  const labelCol = reactive({ span: 8 });
  const routerInfos = reactive({
    routerInfo: {},
    lbType: [],
    customFilters: [],
    customFilterMap: {},
    routeFilters: {},
    routePredicates: {},
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    // 初始化
    formRef.value.resetFields();
    routerInfos.routerInfo = {
      routeState: 1,
    };
    routerInfos.routeFilters = {};
    routerInfos.routePredicates = {};
    routerInfos.customFilterIds = [];
    // 获取详细数据
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      routeId.value = data.routeId;
      const detailData = await getById(routeId.value);
      routerInfos.routerInfo = { ...detailData };
      const routeFilters = detailData.routeFilters;
      if (routeFilters && routeFilters.length > 0) {
        const routeFiltersMap = {};
        routeFilters.forEach((item) => {
          routeFiltersMap[item.filterId] = item;
        });
        routerInfos.routeFilters = routeFiltersMap;
      }
      const routePredicates = detailData.routePredicates;
      if (routePredicates && routePredicates.length > 0) {
        const routePredicateMap = {};
        routePredicates.forEach((item) => {
          routePredicateMap[item.predicateId] = item;
        });
        routerInfos.routePredicates = routePredicateMap;
      }
    }
    routerInfos.routerInfo.isLoadBalancer = params.isLoadBalancer;
    routerInfos.routerInfo.serviceCode = params.serviceCode;
  });
  const getTitle = computed(() => (!unref(isUpdate) ? '新增路由' : '编辑路由'));
  async function handleSubmit() {
    try {
      const waitValues = await unref(formRef).validate();
      if (!waitValues) return;
      const values = { ...waitValues };
      values['serviceId'] = params.serviceId;
      if (Object.keys(routerInfos.routeFilters).length > 0) {
        let routeFilters = [];
        for (let key in routerInfos.routeFilters) {
          routeFilters.push(routerInfos.routeFilters[key]);
        }
        values['routeFilters'] = routeFilters;
      }
      if (Object.keys(routerInfos.routePredicates).length > 0) {
        let routePredicates = [];
        for (let key in routerInfos.routePredicates) {
          routePredicates.push(routerInfos.routePredicates[key]);
        }
        values['routePredicates'] = routePredicates;
        const customFilterIds = values.customFilterIds;
        if (customFilterIds && customFilterIds.length > 0) {
          const customFilters = [];
          customFilterIds.forEach((item) => {
            const customFilter = routerInfos.customFilterMap[item];
            customFilters.push({
              customFilterId: customFilter.customFilterId,
              filterType: customFilter.filterType,
            });
          });
          values['customFilters'] = customFilters;
        }
      }
      setModalProps({ confirmLoading: true });
      try {
        if (unref(isUpdate)) {
          await update(values, routeId.value);
        } else {
          await insert(values);
        }
      } catch (error) {
        console.warn(error);
        return;
      }
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
  async function getLbTypes() {
    routerInfos.lbType = await getListByConstantTypes('gateway-service:LbType');
  }
  async function getCustomFilterList() {
    routerInfos.customFilters = await selectSimpleList(params.serviceId);
    const customFilterMap = {};
    routerInfos.customFilters.forEach((item) => {
      customFilterMap[item.customFilterId] = item;
    });
    routerInfos.customFilterMap = customFilterMap;
  }
  onMounted(() => {
    getLbTypes();
    getCustomFilterList();
  });
  function handleFilterSeccess({ values }) {
    routerInfos.routeFilters[values.filterId] = values;
  }
  function handelAddFilter() {
    openFilterModal(true, {
      isUpdate: false,
    });
  }
  function handelEditFilter(item: any) {
    openFilterModal(true, {
      isUpdate: true,
      data: item,
    });
  }
  function handelRemoveFilter(filterId: string) {
    delete routerInfos.routeFilters[filterId];
  }
  function handlePredicateSeccess({ values }) {
    routerInfos.routePredicates[values.predicateId] = values;
  }
  function handelAddPredicate() {
    openPredicateModal(true, {
      isUpdate: false,
    });
  }
  function handelEditPredicate(item: any) {
    openPredicateModal(true, {
      isUpdate: true,
      data: item,
    });
  }
  function handelRemovePredicate(predicateId: string) {
    delete routerInfos.routePredicates[predicateId];
  }
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-modal-router-detail';
  .@{prefix-cls} {
    .ant-empty {
      font-size: 12px !important;

      .ant-empty-image {
        height: 38px !important;
      }

      p {
        margin-bottom: 0px !important;
      }
    }
  }
</style>
