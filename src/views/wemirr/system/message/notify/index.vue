<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_description="scope">
        <a-tooltip placement="topLeft" :title="scope.row.description">
          {{ scope.row.description }}
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useFs } from "@fast-crud/fast-crud";
import _ from "lodash-es";
import * as api from "./api";

function useSearchRemote() {
  let lastFetchId = 0;
  const state = {
    data: ref([]),
    fetching: ref(false),
  };
  const fetchReceiver = _.debounce((type, value) => {
    lastFetchId += 1;
    const fetchId = lastFetchId;
    state.data.value = [];
    state.fetching.value = true;
    api.SearchReceiver(type, value).then((ret) => {
      if (fetchId !== lastFetchId) {
        return;
      }
      state.data.value = ret.map((data) => ({
        text: data.name,
        label: data.name,
        value: data.id,
      }));
      state.fetching.value = false;
    });
  }, 1000);

  return {
    fetchReceiver,
    searchState: state,
  };
}

export default defineComponent({
  name: "SiteNotifyPage",
  setup() {
    const searchRemote = useSearchRemote();
    const { crudRef, crudBinding, crudExpose } = useFs({
      createCrudOptions,
      searchRemote,
      permission: "sys:site_notify",
    });

    onMounted(() => {
      crudExpose.doRefresh();
      searchRemote.fetchReceiver(2, null);
      searchRemote.fetchReceiver(1, null);
    });
    return {
      searchRemote,
      crudBinding,
      crudRef,
    };
  },
});
</script>
