<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

import { defHttp } from '#/api/request';

import { createFormOptions } from './publish';

const formRef = ref();
const formOptions = ref();
formOptions.value = createFormOptions();
const route = useRoute();
const id: any = route.query.id;

onMounted(async () => {
  defHttp.get(`/iam/message-template/${id}/detail`).then((ret) => {
    const data = ret.data;
    const entries = data.variables?.map((item: any) => [item, '1']);
    formRef.value.setFormData({
      templateId: data.id,
      code: data.code,
      name: data.name,
      content: data.content,
      variables: Object.fromEntries(entries),
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
          <div v-for="(val, key) in scope.form.variables" :key="key">
            <!--            {{ key }} -  {{ val }}-->
            <a-form-item>
              <a-input
                :value="key"
                placeholder="参数键"
                style="width: 23%; margin-right: 8px"
              />
              <a-input
                :value="val"
                placeholder="参数值"
                style="width: 22%; margin-right: 8px"
              />
            </a-form-item>
          </div>
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
