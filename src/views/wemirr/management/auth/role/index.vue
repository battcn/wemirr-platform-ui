<template>
  <PageWrapper contentClass="flex" contentFullHeight fixedHeight class="bg-white m-4 mr-4">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #form_orgList="scope">
        <BasicTree
          v-model:value="scope.form.orgList"
          :treeData="treeData"
          :fieldNames="{ title: 'name', key: 'id' }"
          checkable
          toolbar
          v-if="scope.form.scopeType === 20"
          title="组织架构"
        />
      </template>
      <template #cell_description="scope">
        <a-tooltip placement="top" :title="scope.row.description">
          {{ scope.row.description }}
        </a-tooltip>
      </template>
    </fs-crud>
    <distribution-user @register="registerBindUser" />
    <distribution-resource @register="registerBindResource" />
  </PageWrapper>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";
// import { defHttp } from '@/utils/http/axios'
import { BasicTree } from "/@/components/Tree";
import { useModal } from "/@/components/Modal";
import DistributionUser from "./DistributionUser.vue";
import DistributionResource from "./DistributionResource.vue";
import * as api from "./api";
import { PageWrapper } from "@/components/Page";

function useDistribution() {
  const checkedKeys = ref();

  function userModal(roleId) {
    api.GetUserByRoleId(roleId).then((ret) => {
      openBindUser(true, { roleId, ...ret.data });
    });
  }
  const [registerBindUser, { openModal: openBindUser }] = useModal();

  function resourceModal(roleId) {
    openBindResource(true, roleId);
  }
  const [registerBindResource, { openModal: openBindResource }] = useModal();

  return {
    checkedKeys,
    userModal,
    registerBindUser,
    resourceModal,
    registerBindResource,
  };
}

export default defineComponent({
  name: "SlotsForm",
  components: { PageWrapper, DistributionUser, DistributionResource, BasicTree },
  setup() {
    // crud组件的ref
    const crudRef = ref();
    // crud 配置的ref
    const crudBinding = ref();

    const distribution = useDistribution();
    // 暴露的方法
    const { expose } = useExpose({ crudRef, crudBinding });

    // const go = useGo();
    // 你的crud配置
    const { crudOptions } = createCrudOptions({ expose, distribution });
    // 初始化crud配置
    useCrud({ expose, crudOptions, permission: "role:management" });

    const treeData = ref([]);
    function initOrgList() {
      api.InitOrgList().then((response) => {
        treeData.value = response.data;
      });
    }
    // 页面打开后获取列表数据
    onMounted(() => {
      initOrgList();
      expose.doRefresh();
    });

    return {
      treeData,
      crudBinding,
      crudRef,
      ...distribution,
    };
  },
});
</script>
