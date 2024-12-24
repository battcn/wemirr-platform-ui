<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';

import { PlusSquareOutlined } from '@ant-design/icons-vue';
import { Card } from 'ant-design-vue';

import { defHttp } from '#/api/request';

import { createFormOptions } from './publish';

const formRef = ref();
const formOptions = ref();
formOptions.value = createFormOptions();
const route = useRoute();
const id: any = route.query.id;

function addFilterParams(scopeForm) {
  if (!scopeForm.variables) {
    scopeForm.variables = [];
  }
  scopeForm.variables.push({
    key: '',
    value: '',
  });
}

onMounted(async () => {
  defHttp.get(`/iam/message-template/${id}/detail`).then((data) => {
    const variables = data.variables?.map((item: any) => {
      return { key: item, value: '' };
    });
    formRef.value.setFormData({
      templateId: data.id,
      code: data.code,
      name: data.name,
      content: data.content,
      variables,
    });
  });
});
</script>

<template>
  <Page
    content-class="w-height flex flex-col gap-4"
    description="提供给运营人员操作消息推送"
    title="消息推送"
  >
    <Card>
      <fs-form ref="formRef" v-bind="formOptions">
        <template #form_variables="scope">
          <div v-for="(tag, index) in scope.form.variables" :key="tag[index]">
            <a-form-item>
              <a-input
                v-model:value="tag.key"
                placeholder="参数键"
                style="width: 23%; margin-right: 8px"
              />
              <a-input
                v-model:value="tag.value"
                placeholder="参数值"
                style="width: 22%; margin-right: 8px"
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
      </fs-form>
      <div style="float: right; margin-top: 50px">
        <a-button v-if="formRef" type="primary" @click="formRef.submit">
          发布
        </a-button>
      </div>
    </Card>
  </Page>
</template>
