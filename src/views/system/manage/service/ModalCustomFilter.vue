<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    :min-height="300"
    width="60%"
  >
    <div style="padding-right: 30px">
      <a-form :label-col="labelCol" :model="filterInfos" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="过滤器名称"
              name="filterName"
              :rules="[
                {
                  required: true,
                  message: '请输入过滤器名称',
                  trigger: ['change', 'blur'],
                },
              ]"
            >
              <a-input
                v-model:value="filterInfos.filterName"
                allowClear
                placeholder="请输入服务名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="过滤器类型"
              name="filterType"
              :rules="[
                {
                  required: true,
                  message: '请选择过滤器类型',
                  trigger: ['change', 'blur'],
                },
              ]"
            >
              <a-select
                placeholder="请选择类型"
                v-model:value="filterInfos.filterType"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                @change="handleFilterTypeChange"
                style="width: 100%"
                :options="
                  selectFilterTypes.map((item) => ({
                    value: item.type,
                    label: item.typeDescribe,
                  }))
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="filter状态"
              name="filterStatus"
              :rules="[
                {
                  required: true,
                  message: '请选择filter状态',
                },
              ]"
            >
              <a-radio-group v-model:value="filterInfos.filterStatus" button-style="solid">
                <a-radio-button :value="0">禁用</a-radio-button>
                <a-radio-button :value="1">启用</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="enableUrlType !== 0">
            <a-form-item
              label="是否有特殊url"
              name="haveSpecial"
              :rules="[
                {
                  required: true,
                  message: '请判断是否有特殊url',
                },
              ]"
            >
              <a-radio-group
                v-model:value="filterInfos.haveSpecial"
                button-style="solid"
                @change="handleHaveSpecialChange"
              >
                <a-radio-button :value="0">没有</a-radio-button>
                <a-radio-button :value="1">有</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="备注" name="remark">
              <a-textarea v-model:value="filterInfos.remark" allowClear placeholder="请输入备注" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-divider
      dashed
      style="border-color: #7cb305"
      v-if="filterInfos.haveSpecial == 1 && enableUrlType !== 0"
      >特殊url</a-divider
    >
    <div style="margin: 0 10px" v-if="filterInfos.haveSpecial == 1 && enableUrlType !== 0">
      <div
        style="display: flex; flex-wrap: wrap; margin-left: 8px"
        v-if="filterUrls && Object.keys(filterUrls).length > 0"
      >
        <Popover placement="bottomRight" v-for="item in Object.keys(filterUrls)" :key="item">
          <template #content>
            <div>{{ filterUrls[item]['url'] || '---' }}</div>
          </template>
          <a-tag
            v-if="filterUrls[item]['urlName'].length > 4"
            :color="filterUrls[item]['specialUrlType'] == 1 ? 'processing' : 'warning'"
            closable
            style="margin-bottom: 4px; cursor: pointer"
            @close="handleRemoveUrl(item)"
            @click="handleEditUrl(filterUrls[item])"
          >
            {{ `${filterUrls[item]['urlName'].slice(0, 4)}...` }}
          </a-tag>
          <a-tag
            v-else
            closable
            style="margin-bottom: 4px; cursor: pointer"
            @close="handleRemoveUrl(item)"
            @click="handleEditUrl(filterUrls[item])"
            :color="filterUrls[item]['specialUrlType'] == 1 ? 'processing' : 'warning'"
          >
            {{ filterUrls[item]['urlName'] || '--' }}
          </a-tag>
        </Popover>
      </div>
      <div v-else>
        <a-empty />
      </div>
      <a-button block class="mt-5" type="dashed" @click="handelAddUrl"> 新增url </a-button>
    </div>
    <ModalSpecialUrl @register="registerUrlModal" @success="handleAddUrlSeccess" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { Popover } from 'ant-design-vue';
  import { ref, computed, unref, reactive, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getById, insert, update } from '/@/api/modules/system/manage/manageCustomFilter';
  import { useModal } from '/@/components/Modal';
  import { getListByConstantTypes } from '/@/api/modules/system/common/commonConstant';
  import ModalSpecialUrl from './ModalSpecialUrl.vue';
  const [registerUrlModal, { openModal: openUrlModal }] = useModal();
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const formRef = ref();
  const selectFilterTypeMap = reactive({});
  const selectFilterTypes = reactive([]);
  const enableUrlType = ref(2);
  const serviceId = ref('');
  const labelCol = reactive({ span: 8 });
  const filterTypeName = ref('');
  const filterInfos = ref({
    filterStatus: 1,
    haveSpecial: 0,
  });
  const customFilterId = ref('');
  const filterUrls = ref({});
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    // 初始化
    formRef.value.resetFields();
    filterUrls.value = {};
    filterInfos.value = {
      filterStatus: 1,
      haveSpecial: 0,
    };
    // 获取详细值
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    serviceId.value = data.serviceId;
    if (unref(isUpdate)) {
      customFilterId.value = data.customFilterId;
      const detailData = await getById(customFilterId.value);
      filterInfos.value = { ...detailData };
      handleFilterTypeChange();
      if (detailData.specialUrls && detailData.specialUrls.length > 0) {
        detailData.specialUrls.forEach((item) => {
          filterUrls.value[item.specialUrlId] = item;
        });
      }
    }
  });
  const getTitle = computed(() => (!unref(isUpdate) ? '新增过滤器' : '编辑过滤器'));
  function handelAddUrl() {
    openUrlModal(true, {
      isUpdate: false,
      enableUrlType: enableUrlType.value,
    });
  }
  function handleFilterTypeChange() {
    const type = filterInfos.value['filterType'];
    enableUrlType.value = selectFilterTypeMap[type]?.extendInfo?.specialUrlType || 0;
    console.log('---selectFilterTypeMap[type]-------', selectFilterTypeMap[type]);
    filterTypeName.value = selectFilterTypeMap[type].typeDescribe || '';
  }
  function handleHaveSpecialChange(value) {
    if (value.target.value == 0) {
      filterUrls.value = {};
    }
  }
  function handleAddUrlSeccess({ values }) {
    filterUrls.value[values['specialUrlId']] = values;
  }
  function handleRemoveUrl(specialUrlId: string) {
    delete filterUrls.value[specialUrlId];
  }
  function handleEditUrl(item: any) {
    openUrlModal(true, {
      isUpdate: true,
      data: item,
      enableUrlType: enableUrlType.value,
    });
  }
  async function getCustomFilterTypes() {
    const urlType = await getListByConstantTypes('gateway-service:FilterCustomType');
    urlType.forEach((item) => {
      selectFilterTypeMap[item.type] = item;
      selectFilterTypes.push(item);
    });
  }
  async function handleSubmit() {
    try {
      const values = await unref(formRef).validate();
      if (!values) return;
      values['serviceId'] = serviceId.value;
      const specialUrls: any[] = [];
      if (filterUrls.value && Object.keys(filterUrls.value).length > 0) {
        for (const key in filterUrls.value) {
          specialUrls.push(filterUrls.value[key]);
        }
      }
      values['specialUrls'] = specialUrls;
      values['filterTypeName'] = filterTypeName.value;
      setModalProps({ confirmLoading: true });
      try {
        if (unref(isUpdate)) {
          await update(values, customFilterId.value);
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
  onMounted(() => {
    getCustomFilterTypes();
  });
</script>
