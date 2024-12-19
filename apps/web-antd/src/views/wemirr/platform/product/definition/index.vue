<script>
import { defineComponent, onMounted, ref } from 'vue';

import { useFs } from '@fast-crud/fast-crud';

import * as api from './api';
import createCrudOptions from './crud';
// import { useModal } from "#/components/Modal";
// import DistributionResource from "./DistributionResource.vue";

function useDistribution() {
  const checkedKeys = ref();

  function userModal(productId) {
    api.GetPermissionResByProductId(productId).then((data) => {
      openBindUser(true, { productId, ...data });
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

// 此处为组件定义
export default defineComponent({
  name: 'PlatProductDefinition',
  // components: { DistributionResource },
  setup() {
    // const distribution = useDistribution();
    const { crudRef, crudBinding, crudExpose } = useFs({
      createCrudOptions,
      // distribution,
    });

    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
    });
    return {
      crudBinding,
      crudRef,
      // ...distribution,
    };
  },
});
</script>

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding" />
    <!--    <distribution-resource @register="registerBindResource" />-->
  </fs-page>
</template>
