<script>
import { defineComponent, onMounted, reactive } from 'vue';

import { DeleteOutlined, PlusSquareOutlined } from '@ant-design/icons-vue';
import { useFs } from '@fast-crud/fast-crud';

import createCrudOptions from './crud';

export default defineComponent({
  name: 'I18nDataPage',
  components: { PlusSquareOutlined, DeleteOutlined },
  setup() {
    const { crudBinding, crudRef, crudExpose } = useFs({
      createCrudOptions,
      permission: 'sys:i18n',
    });
    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
    });

    const temp = reactive({
      languages: [
        { locale: 'zh_CN', message: '请填写中文内容' },
        { locale: 'en_US', message: 'Please English Context' },
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
      if (scopeForm.languages === null) {
        scopeForm.languages = [];
        temp.languages.forEach((lang) => {
          scopeForm.languages.push(lang);
        });
      } else {
        scopeForm.languages.push({
          locale: '',
          message: '',
        });
      }
    }

    function handleFilterChange(scopeItem, scopeKey) {
      if (scopeItem[scopeKey] === null) {
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
              v-model:value="tag.locale"
              :disabled="scope.mode === 'view'"
              placeholder="国家"
              style="width: 45%; margin-right: 8px"
            />
            <a-input
              v-model:value="tag.message"
              :disabled="scope.mode === 'view'"
              placeholder="语言文本内容"
              style="width: 40%; margin-right: 8px"
            />
            <DeleteOutlined
              v-show="scope.mode !== 'view'"
              @click="removeFilterParams(scope.form.languages, index)"
            />
          </a-form-item>
        </div>
        <a-button
          v-show="scope.mode !== 'view'"
          size="small"
          style="width: 30%; margin-left: 28%"
          type="dashed"
          @click="addFilterParams(scope.form)"
        >
          <PlusSquareOutlined />
          添加语言
        </a-button>
      </template>
    </fs-crud>
  </fs-page>
</template>
