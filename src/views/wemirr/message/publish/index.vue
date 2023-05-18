<template>
  <PageWrapper contentClass="flex" contentFullHeight fixedHeight class="bg-white m-4 mr-4">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_description="scope">
        <a-tooltip placement="topLeft" :title="scope.row.description">
          {{ scope.row.description }}
        </a-tooltip>
      </template>
    </fs-crud>
  </PageWrapper>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";
import _ from "lodash-es";
import * as api from "./api";
import { PageWrapper } from "@/components/Page";

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
      state.data.value = ret.data.map((data) => ({
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
  name: "PublishMessage",
  components: { PageWrapper },
  setup() {
    // crud组件的ref
    const crudRef = ref();
    // crud 配置的ref
    const crudBinding = ref();

    const searchRemote = useSearchRemote();
    // 暴露的方法
    const { expose } = useExpose({ crudRef, crudBinding });
    // 你的crud配置
    const { crudOptions } = createCrudOptions({ expose, searchRemote });
    // 初始化crud配置
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const { resetCrudOptions } = useCrud({ expose, crudOptions });
    // 你可以调用此方法，重新初始化crud配置
    // resetCrudOptions(options)
    // 页面打开后获取列表数据
    onMounted(() => {
      expose.doRefresh();
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
