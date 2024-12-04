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
      <div style="margin-top: 50px;float: right">
        <a-button v-if="formRef" type="primary" @click="formRef.submit">发布</a-button>
      </div>
    </Card>
  </Page>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {Card} from 'ant-design-vue';
import {Page} from "@vben/common-ui";
import {createFormOptions} from "./publish";
import {defHttp} from "#/api/request";
import {onMounted, ref} from "vue";

const formRef = ref();
const formOptions = ref();
formOptions.value = createFormOptions();
const route = useRoute();
const id: any = route.query.id;

onMounted(async() => {
  // let variables = {'username': 'test', email: 'abc@63.com'}
  // formOptions.value.initialForm = {code: 'xxxx', name: 'name', context: '欢迎 {username} 来到 WP 系统', variables};
  defHttp.get(`/iam/message-template/${id}/detail`).then((ret) => {
    let entries = ret.variables?.map((item: any) => [item, '1']);
    console.log(Object.fromEntries(entries))
    formRef.value.setFormData({
      code: ret.code,
      name: ret.name,
      content: ret.content,
      variables: Object.fromEntries(entries),
    })
  })
})
</script>
