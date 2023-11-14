<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #form_languages="scope">
        <div
          v-for="(tag, index) in scope.form.languages"
          :key="tag.language"
          style="margin-bottom: 10px"
        >
          <a-form-item>
            <a-input
              :disabled="scope.mode === 'view'"
              v-model:value="tag.locale"
              placeholder="国家"
              style="width: 45%; margin-right: 8px"
            />
            <a-input
              :disabled="scope.mode === 'view'"
              v-model:value="tag.message"
              placeholder="语言文本内容"
              style="width: 40%; margin-right: 8px"
            />
            <DeleteOutlined
              @click="removeFilterParams(scope.form.languages, index)"
              v-show="scope.mode !== 'view'"
            />
          </a-form-item>
        </div>
        <a-button
          v-show="scope.mode !== 'view'"
          type="dashed"
          style="margin-left: 28%; width: 30%"
          size="small"
          @click="addFilterParams(scope.form)"
        >
          <PlusSquareOutlined />
          添加语言
        </a-button>
      </template>
    </fs-crud>
  </fs-page>
</template>

<script>
import { defineComponent, onMounted, reactive } from "vue";
import createCrudOptions from "./crud";
import { useFs } from "@fast-crud/fast-crud";
import { DeleteOutlined, PlusSquareOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "I18nDataPage",
  components: { PlusSquareOutlined, DeleteOutlined },
  setup() {
    const { crudBinding, crudRef, crudExpose } = useFs({
      createCrudOptions,
      permission: "sys:i18n",
    });
    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
    });

    const temp = reactive({
      languages: [
        { locale: "zh_CN", message: "请填写中文内容" },
        { locale: "en_US", message: "Please English Context" },
      ],
    });

    function removeFilterParams(scopeItem, filterIndex) {
      scopeItem.splice(filterIndex, 1);
    }

    function removeFilter(scopeItem, scopeIndex, form, key) {
      temp.languages.push(scopeItem);
      form[key].splice(scopeIndex, 1);
    }

    function addFilterParams(scopeForm) {
      if (scopeForm.languages == null) {
        scopeForm.languages = [];
        temp.languages.forEach((lang) => {
          scopeForm.languages.push(lang);
        });
      } else {
        scopeForm.languages.push({
          locale: "",
          message: "",
        });
      }
    }

    function handleFilterChange(scopeItem, scopeKey) {
      if (scopeItem[scopeKey] == null) {
        scopeItem[scopeKey] = [];
      }
      temp.languages.forEach((lang) => {
        scopeItem[scopeKey].push(lang);
      });
    }

    return {
      crudBinding,
      crudRef,
      temp,
      removeFilterParams,
      removeFilter,
      addFilterParams,
      handleFilterChange,
    };
  },
});
</script>
