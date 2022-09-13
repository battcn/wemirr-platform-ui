<template>
  <Select
    @dropdown-visible-change="handleFetch"
    v-bind="$attrs"
    @change="handleChange"
    v-model:value="state"
    :options="getOptions"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </Select>
</template>
<script lang="ts">
  import { defineComponent, ref, watchEffect, computed, unref, watch } from 'vue';
  import { Select } from 'ant-design-vue';
  import { getListByCode } from '/@/api/modules/system/common/commonDict';
  import { CommonDictItemDto } from '/@/api/modules/system/common/model/commonDictModel';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { get } from 'lodash-es';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { propTypes } from '/@/utils/propTypes';
  export default defineComponent({
    name: 'DictSelect',
    components: {
      Select,
      LoadingOutlined,
    },
    inheritAttrs: false,
    props: {
      value: [Array, Object, String, Number],
      dictCode: propTypes.string,
      // support xxx.xxx.xx
      resultField: propTypes.string.def(''),
      immediate: propTypes.bool.def(true),
    },
    emits: ['options-change', 'change'],
    setup(props, { emit }) {
      const options = ref<CommonDictItemDto[]>([]);
      const loading = ref(false);
      const isFirstLoad = ref(true);
      const emitData = ref<any[]>([]);
      const attrs = useAttrs();
      const { t } = useI18n();
      const [state] = useRuleFormItem(props, 'value', 'change', emitData);
      const getOptions = computed(() => {
        return options.value;
      });

      watchEffect(() => {
        props.immediate && fetch();
      });

      watch(
        () => props.dictCode,
        () => {
          !unref(isFirstLoad) && fetch();
        },
        { deep: true },
      );

      async function fetch() {
        options.value = [];
        if (!props.dictCode) {
          return;
        }
        try {
          loading.value = true;
          const res = await getListByCode(props.dictCode);
          if (Array.isArray(res)) {
            res.forEach((item) => {
              item.value =
                item.dictType == 0
                  ? `${item.itemValue}`
                  : item.dictType == 1
                  ? Number(item.itemValue)
                  : Boolean(item.itemValue);
              item.label = item.itemText;
            });
            options.value = res;
            emitChange();
            return;
          }
          if (props.resultField) {
            options.value = get(res, props.resultField) || [];
          }
          emitChange();
        } catch (error) {
          console.warn(error);
        } finally {
          loading.value = false;
        }
      }

      async function handleFetch() {
        if (!props.immediate && unref(isFirstLoad)) {
          await fetch();
          isFirstLoad.value = false;
        }
      }

      function emitChange() {
        emit('options-change', unref(getOptions));
      }

      function handleChange(_, ...args) {
        emitData.value = args;
      }
      return { state, attrs, getOptions, loading, t, handleFetch, handleChange };
    },
  });
</script>
