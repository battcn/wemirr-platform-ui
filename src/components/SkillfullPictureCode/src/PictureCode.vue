<template>
  <a-input v-bind="$attrs" :class="prefixCls" :size="size" :value="code">
    <template #addonAfter>
      <ImageButton :size="size" @codeId="getCodeId" ref="pictureRef" class="imgbutton" />
    </template>
  </a-input>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref } from 'vue';
  import ImageButton from './ImageButton.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';

  const props = {
    value: { type: String },
    size: { type: String, validator: (v) => ['default', 'large', 'small'].includes(v) },
    count: { type: Number, default: 60 },
    sendCodeApi: {
      type: Function as PropType<() => Promise<boolean>>,
      default: null,
    },
  };

  export default defineComponent({
    name: 'PictureCode',
    components: { ImageButton },
    inheritAttrs: false,
    props,
    emits: ['codeId'],
    setup(props, { emit }) {
      const { prefixCls } = useDesign('countdown-input');
      const [code] = useRuleFormItem(props);
      const pictureRef = ref();
      function getCodeId(codeId) {
        emit('codeId', codeId);
      }
      function refreshCode() {
        pictureRef.value.getPicture();
      }
      return { prefixCls, code, getCodeId, refreshCode, pictureRef };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-countdown-input';

  .@{prefix-cls} {
    .ant-input-group-addon {
      padding-right: 0;
      background-color: transparent !important;
      border: none;

      button {
        font-size: 14px;
      }
    }

    .imgbutton {
      cursor: pointer;
    }
  }
</style>
