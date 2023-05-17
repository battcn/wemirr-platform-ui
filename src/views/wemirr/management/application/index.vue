<template>
  <PageWrapper contentClass="flex" contentFullHeight fixedHeight class="bg-white m-4 mr-4">
    <fs-crud ref="crudRef" v-bind="crudBinding"/>
  </PageWrapper>
</template>

<script>
import {defineComponent, ref, onMounted} from 'vue';
import createCrudOptions from './crud';
import {useExpose, useCrud} from '@fast-crud/fast-crud';
import {PageWrapper} from "@/components/Page";

export default defineComponent({
  name: 'ApplicationForm',
  components: {PageWrapper},
  setup() {
    const crudRef = ref();
    const crudBinding = ref();
    const {expose} = useExpose({crudRef, crudBinding});
    const {crudOptions} = createCrudOptions({expose});
    useCrud({expose, crudOptions});
    onMounted(() => {
      expose.doRefresh();
    });

    return {
      crudBinding,
      crudRef,
    };
  },
});
</script>
