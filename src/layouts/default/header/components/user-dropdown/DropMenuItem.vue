<template>
  <MenuItem :key="itemKey">
    <span class="flex items-center">
      <Icon :icon="icon" class="mr-1" />
      <span v-if="text && text.length <= 7">{{ text }}</span>
      <a-tooltip placement="topLeft" :title="text" v-else>
        <span>{{ `${text.slice(0, 7)}...` }}</span>
      </a-tooltip>
    </span>
  </MenuItem>
</template>
<script lang="ts">
  import { Menu } from 'ant-design-vue';

  import { computed, defineComponent, getCurrentInstance } from 'vue';

  import Icon from '/@/components/Icon/index';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'DropdownMenuItem',
    components: { MenuItem: Menu.Item, Icon },
    props: {
      // eslint-disable-next-line
      key: propTypes.string,
      text: propTypes.string,
      icon: propTypes.string,
    },
    setup(props) {
      const instance = getCurrentInstance();
      const itemKey = computed(() => props.key || instance?.vnode?.props?.key);
      return { itemKey };
    },
  });
</script>
