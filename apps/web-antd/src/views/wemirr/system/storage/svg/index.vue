<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'ImgSvg' });

const props = withDefaults(defineProps<Props>(), {
  name: '',
  color: '',
  size: 20,
});

interface Props {
  name: string;
  color?: string;
  size?: number | string;
}

// 判断传入的值，是否带有单位，如果没有，就默认用px单位
const getUnitValue = (value: number | string): number | string => {
  return /(px|em|rem|%)$/.test(value.toString()) ? value : `${value}px`;
};

const iconSize = computed<number | string>(() => {
  return getUnitValue(props.size);
});

const iconName = computed(() => `#icon-${props.name}`);

const svgClass = computed(() => {
  if (props.name) return `svg-icon icon-${props.name}`;
  return 'svg-icon';
});
</script>

<template>
  <svg
    :class="svgClass"
    aria-hidden="true"
    v-bind="$attrs"
    :style="{ color, fill: color, width: iconSize, height: iconSize }"
  >
    <use :xlink:href="iconName" />
  </svg>
</template>

<style scoped lang="scss">
.svg-icon {
  width: auto;
  height: auto;
  // fill: currentColor;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
