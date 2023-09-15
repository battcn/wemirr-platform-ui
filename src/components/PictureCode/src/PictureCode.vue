<template>
  <a-input :class="prefixCls" :size="size" :value="code" v-bind="$attrs">
    <template #addonAfter>
      <ImageButton ref="pictureRef" :size="size" class="imgbutton" />
    </template>
  </a-input>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import ImageButton from "./ImageButton.vue";
import { useDesign } from "@/hooks/web/useDesign";
import { useRuleFormItem } from "@/hooks/component/useFormItem";

const props = {
  value: { type: String },
  size: { type: String, validator: (v) => ["default", "large", "small"].includes(v) },
  count: { type: Number, default: 60 },
};

export default defineComponent({
  name: "PictureCode",
  components: { ImageButton },
  inheritAttrs: false,
  props,
  setup(props, { emit }) {
    const { prefixCls } = useDesign("countdown-input");
    const [code] = useRuleFormItem(props);
    const pictureRef = ref();
    function refreshCode() {
      pictureRef.value.getPicture();
    }
    return { prefixCls, code, refreshCode, pictureRef };
  },
});
</script>
<style lang="less">
@prefix-cls: ~"@{namespace}-countdown-input";

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
