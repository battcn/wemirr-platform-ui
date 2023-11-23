<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #actionbar-right>
        <a-alert
          class="ml-1"
          style="margin-top: 10px"
          type="info"
          message="非专业人士,请勿随便乱动"
        />
      </template>
      <template #form_predicates="scope">
        <div v-for="(scopeItem, scopeIndex) in scope.form.predicates" :key="scopeIndex">
          <a-divider
            >{{ scopeItem.name }}
            <a-button
              v-show="scope.mode !== 'view'"
              @click="removePredicate(scopeItem, scopeIndex, scope.form, scope.key)"
            >
              <DeleteOutlined />
            </a-button>
          </a-divider>
          <a-tag
            v-for="(tag, index) in scopeItem.args"
            :key="index"
            :closable="scope.mode !== 'view'"
            @close="removePredicateTag(scopeItem, tag)"
            color="success"
            >{{ tag }}
          </a-tag>
          <a-input
            v-if="scopeItem.inputVisible"
            v-model:value="scopeItem.inputValue"
            type="text"
            size="small"
            :style="{ width: '100px' }"
            @blur="handleInputConfirm(scopeItem)"
            @keyup.enter="handleInputConfirm(scopeItem)"
          />
          <a-tag
            v-show="scope.mode !== 'view'"
            v-else
            color="#2db7f5"
            style="margin-left: 10px; margin-bottom: 15px"
            @click="showInput(scopeItem)"
          >
            <PlusSquareOutlined />
            新建{{ scopeItem.predicate }}
          </a-tag>
        </div>
        <a-dropdown>
          <a-button
            v-show="scope.mode !== 'view'"
            type="dashed"
            @mouseover="processPredicates(scope)"
            style="width: 100%"
          >
            添加路由条件
            <DownOutlined />
          </a-button>
          <template #overlay>
            <a-menu style="margin-top: 12px">
              <!-- 取出差集 -->
              <a-menu-item
                v-for="predicate in router.predicates"
                :key="predicate"
                @click="handlePredicateChange(predicate, scope.form, scope.key)"
              >
                {{ predicate }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>

      <template #form_filters="scope">
        <div v-for="(scopeItem, scopeIndex) in scope.form.filters" :key="scopeIndex">
          <a-divider
            >{{ scopeItem.name }}
            <a-button
              v-show="scope.mode !== 'view'"
              @click="removeFilter(scopeItem, scopeIndex, scope.form, scope.key)"
            >
              <DeleteOutlined />
            </a-button>
          </a-divider>
          <div v-for="(tag, index) in scopeItem.args" :key="tag.key" style="margin-bottom: 10px">
            <a-form-item>
              <a-input
                :disabled="scope.mode === 'view'"
                v-model:value="tag.key"
                placeholder="参数键"
                style="width: 45%; margin-right: 8px"
              />
              <a-input
                :disabled="scope.mode === 'view'"
                v-model:value="tag.value"
                placeholder="参数值"
                style="width: 40%; margin-right: 8px"
              />
              <DeleteOutlined
                @click="removeFilterParams(scopeItem, index)"
                v-show="scope.mode !== 'view'"
              />
            </a-form-item>
          </div>
          <a-button
            v-show="scope.mode !== 'view'"
            type="dashed"
            style="margin-left: 28%; width: 30%"
            size="small"
            @click="addFilterParams(scopeItem)"
          >
            <PlusSquareOutlined />
            添加参数
          </a-button>
        </div>
        <a-dropdown>
          <a-button
            v-show="scope.mode !== 'view'"
            type="dashed"
            style="width: 100%"
            @mouseover="processFilters(scope)"
          >
            添加过滤器
            <DownOutlined />
          </a-button>
          <template #overlay>
            <a-menu style="margin-top: 12px">
              <a-menu-item
                v-for="filter in router.filters"
                :key="filter.name"
                @click="handleFilterChange(filter, scope.form, scope.key)"
              >
                {{ filter.title }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </fs-crud>
  </fs-page>
</template>

<script>
import { defineComponent, reactive, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";
import { PlusSquareOutlined, DeleteOutlined, DownOutlined } from "@ant-design/icons-vue";
import { predicates, filters } from "./data";
import { cloneDeep } from "lodash-es";

export default defineComponent({
  name: "GatewayRouteForm",
  components: { DeleteOutlined, PlusSquareOutlined, DownOutlined },
  setup() {
    const crudRef = ref();
    const crudBinding = ref();
    const inputValue = "";
    const { expose } = useExpose({ crudRef, crudBinding });

    const router = reactive({
      predicates: predicates,
      filters: filters,
    });
    const cloneDeepRouter = cloneDeep(router);

    const { crudOptions } = createCrudOptions({ expose });
    useCrud({ expose, crudOptions });
    onMounted(() => {
      expose.doRefresh();
    });

    function removePredicate(scopeItem, scopeIndex, form, key) {
      router.predicates.push(scopeItem.name);
      form[key].splice(scopeIndex, 1);
    }

    function addTopic(form, key) {
      if (form[key] == null) {
        form[key] = [];
      }
      form[key].push("");
    }

    //删除路由条件配置项
    function removePredicateTag(scopeItem, removedTag) {
      scopeItem.args = scopeItem.args.filter((tag) => tag !== removedTag);
    }

    function handleInputConfirm(scopeItem) {
      if (scopeItem.inputValue) {
        scopeItem.args.push(scopeItem.inputValue);
        scopeItem.args = [...new Set(scopeItem.args)];
        scopeItem.inputValue = undefined;
      }
      scopeItem.inputVisible = false;
    }

    function handlePredicateChange(name, scopeForm, scopeKey) {
      router.predicates.splice(
        router.predicates.findIndex((item) => item === name),
        1
      );
      if (scopeForm[scopeKey] == null) {
        scopeForm[scopeKey] = [];
      }
      const args = [];
      const item = { name, args };
      scopeForm[scopeKey].push(item);
    }

    function showInput(scopeItem) {
      scopeItem.inputVisible = true;
    }

    function processPredicates(scope) {
      router.predicates = cloneDeep(cloneDeepRouter).predicates;
      if (scope.form.predicates) {
        const predicates = new Set(scope.form.predicates?.map((item) => item.name));
        router.predicates = router.predicates.filter((item) => !predicates.has(item));
      }
    }

    function processFilters(scope) {
      router.filters = cloneDeep(cloneDeepRouter).filters;
      if (scope.form.filters) {
        const filters = new Set(scope.form.filters?.map((item) => item.name));
        router.filters = router.filters.filter((item) => !filters.has(item.name));
      }
    }

    function handleFilterChange(filter, scopeForm, scopeKey) {
      router.filters.splice(
        router.filters.findIndex((item) => item.name === filter.name),
        1
      );
      if (scopeForm[scopeKey] == null) {
        scopeForm[scopeKey] = [];
      }
      scopeForm[scopeKey].push(filter);
    }

    function removeFilterParams(scopeItem, filterIndex) {
      scopeItem.args.splice(filterIndex, 1);
    }

    function removeFilter(scopeItem, scopeIndex, form, key) {
      router.filters.push(scopeItem);
      form[key].splice(scopeIndex, 1);
    }

    function addFilterParams(scopeForm) {
      scopeForm.args.push({
        key: "_genkey_" + (scopeForm.args.length + 1),
        value: "",
      });
    }

    const log = (tag) => {
      console.log(tag);
    };
    return {
      removeFilterParams,
      removeFilter,
      addFilterParams,
      processPredicates,
      processFilters,
      inputValue,
      showInput,
      router,
      log,
      handleFilterChange,
      handlePredicateChange,
      handleInputConfirm,
      removePredicateTag,
      removePredicate,
      addTopic,
      crudBinding,
      crudRef,
    };
  },
});
</script>
