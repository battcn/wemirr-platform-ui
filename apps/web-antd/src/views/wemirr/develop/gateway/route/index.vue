<script>
import { defineComponent, onMounted, reactive } from 'vue';

import {
  DeleteOutlined,
  DownOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons-vue';
import { useFs } from '@fast-crud/fast-crud';
import { cloneDeep } from 'lodash-es';

import createCrudOptions from './crud';
import { filters, predicates } from './data';

export default defineComponent({
  name: 'GatewayRouteForm',
  components: { DeleteOutlined, PlusSquareOutlined, DownOutlined },
  setup() {
    const inputValue = '';
    const { crudRef, crudBinding, crudExpose } = useFs({ createCrudOptions });

    const router = reactive({
      predicates,
      filters,
    });
    const cloneDeepRouter = cloneDeep(router);

    onMounted(() => {
      crudExpose.doRefresh();
    });

    function removePredicate(scopeItem, scopeIndex, form, key) {
      router.predicates.push(scopeItem.name);
      form[key].splice(scopeIndex, 1);
    }

    function addTopic(form, key) {
      if (form[key] === null) {
        form[key] = [];
      }
      form[key].push('');
    }

    // 删除路由条件配置项
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
      router.predicates.splice(router.predicates.indexOf(name), 1);
      if (!scopeForm[scopeKey]) {
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
        const predicates = new Set(
          scope.form.predicates?.map((item) => item.name),
        );
        router.predicates = router.predicates.filter(
          (item) => !predicates.has(item),
        );
      }
    }

    function processFilters(scope) {
      router.filters = cloneDeep(cloneDeepRouter).filters;
      if (scope.form.filters) {
        const filters = new Set(scope.form.filters?.map((item) => item.name));
        router.filters = router.filters.filter(
          (item) => !filters.has(item.name),
        );
      }
    }

    function handleFilterChange(filter, scopeForm, scopeKey) {
      router.filters.splice(
        router.filters.findIndex((item) => item.name === filter.name),
        1,
      );
      if (!scopeForm[scopeKey]) {
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
        key: `_genkey_${scopeForm.args.length + 1}`,
        value: '',
      });
    }

    return {
      removeFilterParams,
      removeFilter,
      addFilterParams,
      processPredicates,
      processFilters,
      inputValue,
      showInput,
      router,
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

<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #actionbar-right>
        <a-alert
          class="ml-1"
          message="非专业人士,请勿随便乱动"
          style="margin-top: 10px"
          type="info"
        />
      </template>
      <template #form_predicates="scope">
        <div
          v-for="(scopeItem, scopeIndex) in scope.form.predicates"
          :key="scopeIndex"
        >
          <a-divider>
            {{ scopeItem.name }}
            <a-button
              v-show="scope.mode !== 'view'"
              @click="
                removePredicate(scopeItem, scopeIndex, scope.form, scope.key)
              "
            >
              <DeleteOutlined />
            </a-button>
          </a-divider>
          <a-tag
            v-for="(tag, index) in scopeItem.args"
            :key="index"
            :closable="scope.mode !== 'view'"
            color="success"
            @close="removePredicateTag(scopeItem, tag)"
          >
            {{ tag }}
          </a-tag>
          <a-input
            v-if="scopeItem.inputVisible"
            v-model:value="scopeItem.inputValue"
            :style="{ width: '100px' }"
            size="small"
            type="text"
            @blur="handleInputConfirm(scopeItem)"
            @keyup.enter="handleInputConfirm(scopeItem)"
          />
          <a-tag
            v-else
            v-show="scope.mode !== 'view'"
            color="#2db7f5"
            style="margin-bottom: 15px; margin-left: 10px"
            @click="showInput(scopeItem)"
          >
            <PlusSquareOutlined />
            新建{{ scopeItem.predicate }}
          </a-tag>
        </div>
        <a-dropdown>
          <a-button
            v-show="scope.mode !== 'view'"
            style="width: 100%"
            type="dashed"
            @mouseover="processPredicates(scope)"
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
        <div
          v-for="(scopeItem, scopeIndex) in scope.form.filters"
          :key="scopeIndex"
        >
          <!--          {{scopeItem}}-->
          <a-divider>
            {{ scopeItem.name }}
            <a-button
              v-show="scope.mode !== 'view'"
              @click="
                removeFilter(scopeItem, scopeIndex, scope.form, scope.key)
              "
            >
              <DeleteOutlined />
            </a-button>
          </a-divider>
          <div
            v-for="(tag, index) in scopeItem.args"
            :key="tag.key"
            style="margin-bottom: 10px"
          >
            <a-form-item>
              <a-input
                v-model:value="tag.key"
                :disabled="scope.mode === 'view'"
                placeholder="参数键"
                style="width: 45%; margin-right: 8px"
              />
              <a-input
                v-model:value="tag.value"
                :disabled="scope.mode === 'view'"
                placeholder="参数值"
                style="width: 40%; margin-right: 8px"
              />
              <DeleteOutlined
                v-show="scope.mode !== 'view'"
                @click="removeFilterParams(scopeItem, index)"
              />
            </a-form-item>
          </div>
          <a-button
            v-show="scope.mode !== 'view'"
            size="small"
            style="width: 30%; margin-left: 28%"
            type="dashed"
            @click="addFilterParams(scopeItem)"
          >
            <PlusSquareOutlined />
            添加参数
          </a-button>
        </div>
        <a-dropdown>
          <a-button
            v-show="scope.mode !== 'view'"
            style="width: 100%"
            type="dashed"
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
