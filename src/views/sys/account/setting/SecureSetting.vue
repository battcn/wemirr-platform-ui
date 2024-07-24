<template>
  <CollapseContainer title="安全设置" :canExpan="false">
    <List>
      <template v-for="item in list" :key="item.key">
        <ListItem>
          <ListItemMeta>
            <template #title>
              {{ item.title }}
              <div class="extra" v-if="item.extra" @click="securitySettingHandler(item)">
                {{ item.extra }}
              </div>
            </template>
            <template #description>
              <div>{{ item.description }}</div>
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>
  </CollapseContainer>
</template>
<script lang="ts">
import { List } from "ant-design-vue";
import { defineComponent } from "vue";
import { CollapseContainer } from "@/components/Container";

import { secureSettingList } from "./data";
import { CreateCrudOptionsProps, useColumns, useFormWrapper } from "@fast-crud/fast-crud";
import createCrudOptions from "./secure";

function createFormOptionsFromCrudOptions() {
  const { buildFormOptions } = useColumns();
  //可以直接复用crud.js
  const { crudOptions } = createCrudOptions({} as CreateCrudOptionsProps);
  return buildFormOptions(crudOptions);
}
/**
 * 无需写 fs-form-wrapper标签，直接打开对话框
 * 此方式可以层叠打开多个对话框
 */
function useFormProvider() {
  const { openDialog } = useFormWrapper();

  async function openFormWrapperNoTag() {
    const opts = createFormOptionsFromCrudOptions();
    const wrapperRef = await openDialog(opts);
  }
  return {
    openFormWrapperNoTag,
  };
}
export default defineComponent({
  components: { CollapseContainer, List, ListItem: List.Item, ListItemMeta: List.Item.Meta },
  setup() {
    const { openFormWrapperNoTag } = useFormProvider();
    function securitySettingHandler(item: any) {
      if (item.key === "1") {
        openFormWrapperNoTag();
      }
    }

    return {
      securitySettingHandler,
      list: secureSettingList,
    };
  },
});
</script>
<style lang="less" scoped>
.extra {
  margin-top: 10px;
  margin-right: 30px;
  float: right;
  color: #1890ff;
  font-weight: normal;
  cursor: pointer;
}
</style>
