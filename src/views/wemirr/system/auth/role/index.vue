<template>
  <fs-page class="page-layout-card">
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
  </fs-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useFs } from "@fast-crud/fast-crud";
import { BasicTree } from "@/components/Tree";
import { useModal } from "@/components/Modal";
import DistributionUser from "./DistributionUser.vue";
import DistributionResource from "./DistributionResource.vue";
import * as api from "./api";

function useDistribution() {
  const checkedKeys = ref();

  function userModal(roleId) {
    api.GetUserByRoleId(roleId).then((data) => {
      openBindUser(true, { roleId, ...data });
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
  name: "SysRolePage",
  components: { DistributionUser, DistributionResource, BasicTree },
  setup() {
    const distribution = useDistribution();
    const { crudRef, crudBinding, crudExpose } = useFs({
      createCrudOptions,
      distribution,
      permission: "sys:role",
    });

    const treeData = ref([]);
    function initOrgList() {
      api.InitOrgList().then((response) => {
        treeData.value = response.data;
      });
    }
    // 页面打开后获取列表数据
    onMounted(() => {
      initOrgList();
      crudExpose.doRefresh();
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
